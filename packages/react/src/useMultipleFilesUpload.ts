import { createMultipleFilesUploadMachine, FileItemRef } from '@nhost/hasura-storage-js'
import { useInterpret, useSelector } from '@xstate/react'

import { UploadProgressState } from './useFileUpload'
import { useNhostClient } from './useNhostClient'

export interface MultipleFilesUploadState extends UploadProgressState {
  /**
   * Returns `true` when all the files have been successfully uploaded.
   */
  isUploaded: boolean
  /**
   * Returns `true` when the files are being uploaded.
   */
  isUploading: boolean
  /**
   * Returns the overall progress of the upload, from 0 to 100. Returns null if the upload has not started yet.
   */
  progress: number | null
  /**
   * The list of files. The properties can be accessed through `item.getSnapshot()` of with the `useFileUploadItem` hook.
   */
  list: FileItemRef[]
  /**
   * Returns `true` when at least one file failed to upload.
   */
  hasError: boolean
}

export interface MultipleFilesHookResult extends MultipleFilesUploadState {
  /**
   * Add one or multiple files to add to the list of files to upload.
   */
  add: (files: File[]) => void
  /**
   * Upload the files that has been previously added to the list.
   */
  upload: (options?: UploadMultipleFilesActionParams) => void // TODO promisify
  /**
   * Cancel the ongoing upload. The files that have been successfully uploaded will not be deleted from the server.
   */
  cancel: () => void
  /**
   * Clear the list of files.
   */
  clear: () => void
}

type UploadMultipleFilesActionParams = {
  bucketId?: string
}

/**
 * Use the hook `useFileUpload` to upload multiple files.
 *
 * @example
 * ```tsx
 * const { upload, add, clear, progress, isUploaded, isUploading, list, hasError, cancel } = useMultipleFilesUpload()
 *
 * const addFile = async (file: File) => {
 *   add(file)
 * }
 *
 * const handleSubmit = async (e) => {
 *   e.preventDefault();
 *   upload()
 * }
 * ```
 * @docs https://docs.nhost.io/reference/react/use-multiple-files-upload
 */
export const useMultipleFilesUpload = (): MultipleFilesHookResult => {
  const nhost = useNhostClient()
  const service = useInterpret(createMultipleFilesUploadMachine)

  const add = (files: File | File[]) => {
    service.send('ADD', { files })
  }

  const upload = (options: UploadMultipleFilesActionParams = { bucketId: 'default' }) => {
    const { bucketId } = options
    service.send({
      type: 'UPLOAD',
      url: nhost.storage.url,
      bucketId,
      accessToken: nhost.auth.getAccessToken(),
      adminSecret: nhost.adminSecret
    })
  }

  const cancel = () => {
    service.send('CANCEL')
  }

  const clear = () => {
    service.send('CLEAR')
  }

  const isUploading = useSelector(service, (state) => state.matches('uploading'))
  const isUploaded = useSelector(service, (state) => state.matches('uploaded'))
  const hasError = useSelector(service, (state) => state.matches('error'))

  const progress = useSelector(service, (state) => state.context.progress)
  const list = useSelector(service, (state) => state.context.files)

  return {
    upload,
    add,
    clear,
    cancel,
    progress,
    isUploaded,
    isUploading,
    list,
    hasError
  }
}
