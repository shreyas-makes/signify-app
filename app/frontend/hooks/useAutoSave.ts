import { useCallback, useEffect, useRef, useState } from 'react'

export type SaveStatus = 'typing' | 'saving' | 'saved' | 'error'

interface SaveData {
  document: {
    title: string
    content: string
  }
  keystrokes?: unknown[]
  paste_attempts?: unknown[]
}

interface AutoSaveOptions {
  saveInterval?: number // milliseconds, default 30000 (30 seconds)
  typingIndicatorDelay?: number // milliseconds, default 1000
  retryAttempts?: number // default 3
  retryDelay?: number // milliseconds, default 2000
  onSave: (data: SaveData) => Promise<boolean>
  onError?: (error: Error, attempt: number) => void
}

interface AutoSaveState {
  saveStatus: SaveStatus
  lastSaved: Date | null
  isTyping: boolean
  hasUnsavedChanges: boolean
  retryCount: number
}

export function useAutoSave(options: AutoSaveOptions) {

  const [state, setState] = useState<AutoSaveState>({
    saveStatus: 'saved',
    lastSaved: null,
    isTyping: false,
    hasUnsavedChanges: false,
    retryCount: 0
  })

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataRef = useRef<SaveData | null>(null)
  const pendingSaveRef = useRef<SaveData | null>(null)
  const optionsRef = useRef(options)
  
  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = null
    }
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
  }, [])

  // Check if data has changed
  const hasDataChanged = useCallback((newData: SaveData) => {
    if (!lastDataRef.current) return true
    
    return (
      lastDataRef.current.document.title !== newData.document.title ||
      lastDataRef.current.document.content !== newData.document.content
    )
  }, [])

  // Perform save operation with retry logic
  const performSave = useCallback(async (data: SaveData, attempt = 1): Promise<void> => {
    setState(prev => ({ ...prev, saveStatus: 'saving' }))

    try {
      const success = await optionsRef.current.onSave(data)
      
      if (success) {
        lastDataRef.current = data
        pendingSaveRef.current = null
        setState(prev => ({
          ...prev,
          saveStatus: 'saved',
          lastSaved: new Date(),
          hasUnsavedChanges: false,
          retryCount: 0,
          isTyping: false
        }))
      } else {
        throw new Error('Save operation returned false')
      }
    } catch (error) {
      const saveError = error instanceof Error ? error : new Error('Unknown save error')
      
      if (attempt < (optionsRef.current.retryAttempts ?? 3)) {
        setState(prev => ({ ...prev, retryCount: attempt }))
        optionsRef.current.onError?.(saveError, attempt)
        
        // Schedule retry
        retryTimerRef.current = setTimeout(() => {
          void performSave(data, attempt + 1)
        }, optionsRef.current.retryDelay ?? 2000)
      } else {
        // Max retries reached
        setState(prev => ({
          ...prev,
          saveStatus: 'error',
          retryCount: attempt
        }))
        optionsRef.current.onError?.(saveError, attempt)
      }
    }
  }, [])

  // Start auto-save timer
  const startAutoSaveTimer = useCallback((data: SaveData) => {
    clearTimers()
    
    autoSaveTimerRef.current = setTimeout(() => {
      // Always save the data if it has changed, regardless of typing state
      // The typing state is just for UI feedback
      if (hasDataChanged(data)) {
        void performSave(data)
      }
    }, optionsRef.current.saveInterval ?? 30000)
  }, [clearTimers, hasDataChanged, performSave])

  // Mark as typing and reset typing timer
  const markAsTyping = useCallback(() => {
    setState(prev => ({ ...prev, isTyping: true, saveStatus: 'typing' }))
    
    // Clear existing typing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
    }
    
    // Set timer to stop typing indicator
    typingTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isTyping: false }))
    }, optionsRef.current.typingIndicatorDelay ?? 1000)
  }, [])

  // Update data and trigger auto-save logic  
  const updateData = useCallback((data: SaveData) => {
    if (hasDataChanged(data)) {
      pendingSaveRef.current = data
      setState(prev => ({ ...prev, hasUnsavedChanges: true }))
      markAsTyping()
      startAutoSaveTimer(data)
    }
  }, [hasDataChanged, markAsTyping, startAutoSaveTimer])

  // Manual save
  const save = useCallback(async (data?: SaveData) => {
    const saveData = data ?? pendingSaveRef.current
    if (saveData) {
      clearTimers()
      await performSave(saveData)
    }
  }, [performSave, clearTimers])

  // Manual retry
  const retry = useCallback(async () => {
    if (pendingSaveRef.current && state.saveStatus === 'error') {
      await performSave(pendingSaveRef.current)
    }
  }, [performSave, state.saveStatus])

  // Reset auto-save state
  const reset = useCallback((initialData?: SaveData) => {
    clearTimers()
    lastDataRef.current = initialData ?? null
    pendingSaveRef.current = null
    setState({
      saveStatus: 'saved',
      lastSaved: initialData ? new Date() : null,
      isTyping: false,
      hasUnsavedChanges: false,
      retryCount: 0
    })
  }, [clearTimers])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [clearTimers])

  return {
    ...state,
    updateData,
    save,
    retry,
    reset,
    getSaveStatusText: () => {
      switch (state.saveStatus) {
        case 'typing':
          return 'Typing...'
        case 'saving':
          return 'Saving...'
        case 'saved':
          return state.lastSaved ? `Saved at ${state.lastSaved.toLocaleTimeString()}` : 'Saved'
        case 'error':
          return `Error saving (attempt ${state.retryCount}/${optionsRef.current.retryAttempts ?? 3})`
      }
    },
    getSaveStatusColor: () => {
      switch (state.saveStatus) {
        case 'typing':
          return 'secondary' as const
        case 'saving':
          return 'secondary' as const
        case 'saved':
          return 'default' as const
        case 'error':
          return 'destructive' as const
      }
    }
  }
}