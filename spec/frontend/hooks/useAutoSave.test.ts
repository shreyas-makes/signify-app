/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useAutoSave } from '@/hooks/useAutoSave'

// Mock timers
jest.useFakeTimers()

describe('useAutoSave', () => {
  let mockOnSave: jest.Mock
  let mockOnError: jest.Mock

  beforeEach(() => {
    mockOnSave = jest.fn()
    mockOnError = jest.fn()
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.useFakeTimers()
  })

  describe('initial state', () => {
    it('starts with saved status', () => {
      const { result } = renderHook(() =>
        useAutoSave({
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      expect(result.current.saveStatus).toBe('saved')
      expect(result.current.hasUnsavedChanges).toBe(false)
      expect(result.current.isTyping).toBe(false)
      expect(result.current.lastSaved).toBeNull()
      expect(result.current.retryCount).toBe(0)
    })
  })

  describe('updateData', () => {
    it('changes status to typing when data is updated', () => {
      const { result } = renderHook(() =>
        useAutoSave({
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      act(() => {
        result.current.updateData({
          document: { title: 'New Title', content: 'New Content' },
        })
      })

      expect(result.current.saveStatus).toBe('typing')
      expect(result.current.hasUnsavedChanges).toBe(true)
      expect(result.current.isTyping).toBe(true)
    })

    it('stops showing typing status after typing delay', async () => {
      const { result } = renderHook(() =>
        useAutoSave({
          typingIndicatorDelay: 1000,
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      act(() => {
        result.current.updateData({
          document: { title: 'New Title', content: 'New Content' },
        })
      })

      expect(result.current.isTyping).toBe(true)

      // Fast forward past typing delay
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(result.current.isTyping).toBe(false)
      })
    })

    it('triggers auto-save after save interval', async () => {
      mockOnSave.mockResolvedValue(true)

      const { result } = renderHook(() =>
        useAutoSave({
          saveInterval: 30000,
          typingIndicatorDelay: 1000,
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      const testData = {
        document: { title: 'Auto Save Test', content: 'Content' },
      }

      act(() => {
        result.current.updateData(testData)
      })

      // Fast forward past typing delay
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Fast forward to trigger auto-save
      await act(async () => {
        jest.advanceTimersByTime(30000)
      })

      expect(mockOnSave).toHaveBeenCalledWith(testData)
    })

    it('does not auto-save while user is typing', async () => {
      mockOnSave.mockResolvedValue(true)

      const { result } = renderHook(() =>
        useAutoSave({
          saveInterval: 30000,
          typingIndicatorDelay: 2000,
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      act(() => {
        result.current.updateData({
          document: { title: 'Typing Test', content: 'Content' },
        })
      })

      // Fast forward to auto-save time but before typing delay
      await act(async () => {
        jest.advanceTimersByTime(30000)
      })

      // Should not save while still typing
      expect(mockOnSave).not.toHaveBeenCalled()
    })
  })

  describe('manual save', () => {
    it('saves data immediately when save is called', async () => {
      mockOnSave.mockResolvedValue(true)

      const { result } = renderHook(() =>
        useAutoSave({
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      const testData = {
        document: { title: 'Manual Save', content: 'Content' },
      }

      await act(async () => {
        await result.current.save(testData)
      })

      expect(mockOnSave).toHaveBeenCalledWith(testData)
      expect(result.current.saveStatus).toBe('saved')
      expect(result.current.hasUnsavedChanges).toBe(false)
    })

    it('shows saving status during save operation', async () => {
      let resolveSave: (value: boolean) => void
      const savePromise = new Promise<boolean>((resolve) => {
        resolveSave = resolve
      })
      mockOnSave.mockReturnValue(savePromise)

      const { result } = renderHook(() =>
        useAutoSave({
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      const testData = {
        document: { title: 'Saving Status Test', content: 'Content' },
      }

      // Start save
      const saveOperation = act(async () => {
        await result.current.save(testData)
      })

      // Should show saving status
      expect(result.current.saveStatus).toBe('saving')

      // Complete save
      resolveSave!(true)
      await saveOperation

      expect(result.current.saveStatus).toBe('saved')
    })
  })

  describe('error handling and retry', () => {
    it('retries failed saves automatically', async () => {
      mockOnSave.mockRejectedValueOnce(new Error('Network error'))
      mockOnSave.mockResolvedValueOnce(true)

      const { result } = renderHook(() =>
        useAutoSave({
          retryAttempts: 3,
          retryDelay: 2000,
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      const testData = {
        document: { title: 'Retry Test', content: 'Content' },
      }

      // Start save that will fail
      const saveOperation = act(async () => {
        await result.current.save(testData)
      })

      // Fast forward past retry delay
      await act(async () => {
        jest.advanceTimersByTime(2000)
      })

      await saveOperation

      // Should have retried and succeeded
      expect(mockOnSave).toHaveBeenCalledTimes(2)
      expect(result.current.saveStatus).toBe('saved')
    })

    it('shows error status after max retries', async () => {
      mockOnSave.mockRejectedValue(new Error('Persistent error'))

      const { result } = renderHook(() =>
        useAutoSave({
          retryAttempts: 2,
          retryDelay: 1000,
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      const testData = {
        document: { title: 'Error Test', content: 'Content' },
      }

      // Start save that will fail
      const saveOperation = act(async () => {
        await result.current.save(testData)
      })

      // Fast forward through all retries
      await act(async () => {
        jest.advanceTimersByTime(3000) // Multiple retry delays
      })

      await saveOperation

      expect(result.current.saveStatus).toBe('error')
      expect(result.current.retryCount).toBe(2)
      expect(mockOnError).toHaveBeenCalledTimes(2)
    })

    it('allows manual retry after error', async () => {
      mockOnSave.mockRejectedValueOnce(new Error('Initial error'))
      mockOnSave.mockResolvedValueOnce(true)

      const { result } = renderHook(() =>
        useAutoSave({
          retryAttempts: 1, // Only one auto-retry
          retryDelay: 1000,
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      const testData = {
        document: { title: 'Manual Retry Test', content: 'Content' },
      }

      // Initial save that fails
      await act(async () => {
        await result.current.save(testData)
        jest.advanceTimersByTime(1000)
      })

      expect(result.current.saveStatus).toBe('error')

      // Manual retry
      await act(async () => {
        await result.current.retry()
      })

      expect(result.current.saveStatus).toBe('saved')
    })
  })

  describe('status text and colors', () => {
    it('returns correct status text for each state', () => {
      const { result } = renderHook(() =>
        useAutoSave({
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      // Test typing status
      act(() => {
        result.current.updateData({
          document: { title: 'Test', content: 'Content' },
        })
      })
      expect(result.current.getSaveStatusText()).toBe('Typing...')

      // Test saved status
      act(() => {
        result.current.reset()
      })
      expect(result.current.getSaveStatusText()).toBe('Saved')
    })

    it('returns correct status colors for each state', () => {
      const { result } = renderHook(() =>
        useAutoSave({
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      // Test typing color
      act(() => {
        result.current.updateData({
          document: { title: 'Test', content: 'Content' },
        })
      })
      expect(result.current.getSaveStatusColor()).toBe('secondary')

      // Test saved color
      act(() => {
        result.current.reset()
      })
      expect(result.current.getSaveStatusColor()).toBe('default')
    })
  })

  describe('data change detection', () => {
    it('does not trigger auto-save for identical data', () => {
      const { result } = renderHook(() =>
        useAutoSave({
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      const testData = {
        document: { title: 'Same Title', content: 'Same Content' },
      }

      // Set initial data
      act(() => {
        result.current.updateData(testData)
      })

      // Reset save status
      act(() => {
        result.current.reset(testData)
      })

      // Update with same data
      act(() => {
        result.current.updateData(testData)
      })

      expect(result.current.hasUnsavedChanges).toBe(false)
      expect(result.current.saveStatus).toBe('saved')
    })

    it('triggers auto-save when content changes', () => {
      const { result } = renderHook(() =>
        useAutoSave({
          onSave: mockOnSave,
          onError: mockOnError,
        })
      )

      const initialData = {
        document: { title: 'Title', content: 'Initial Content' },
      }

      const updatedData = {
        document: { title: 'Title', content: 'Updated Content' },
      }

      // Set initial data
      act(() => {
        result.current.reset(initialData)
      })

      // Update with different content
      act(() => {
        result.current.updateData(updatedData)
      })

      expect(result.current.hasUnsavedChanges).toBe(true)
      expect(result.current.saveStatus).toBe('typing')
    })
  })
})