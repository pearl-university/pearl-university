import type { FC } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineCloudArrowUp,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineTrash,
} from 'react-icons/hi2'
import { FaFilePdf } from 'react-icons/fa6'
import { useUI } from '../../../context/UIContext'

export interface ScreeningDocument {
  id: string
  title: string
  required: boolean
  uploadedFileName?: string
  progress: number // 0 to 100
  status: 'idle' | 'uploading' | 'verified'
}

const INITIAL_DOCUMENTS: ScreeningDocument[] = [
  {
    id: 'jamb-slip',
    title: 'JAMB Original Result Slip',
    required: true,
    progress: 0,
    status: 'idle',
  },
  {
    id: 'admission-statement',
    title: 'Pearl University statement of Admission',
    required: true,
    progress: 0,
    status: 'idle',
  },
  {
    id: 'olevel-result',
    title: "O'Level Result — WAEC, NECO or NABTEB",
    required: true,
    progress: 0,
    status: 'idle',
  },
  {
    id: 'birth-certificate',
    title: 'Birth Certificate or Age Declaration',
    required: true,
    progress: 0,
    status: 'idle',
  },
  {
    id: 'origin-certificate',
    title: 'Certificate of Origin / Local Government Identification',
    required: true,
    progress: 0,
    status: 'idle',
  },
  {
    id: 'attestation-one',
    title: 'Letter of Attestation (First)',
    required: true,
    progress: 0,
    status: 'idle',
  },
  {
    id: 'attestation-two',
    title: 'Letter of Attestation (Second)',
    required: true,
    progress: 0,
    status: 'idle',
  },
]

export const OnlineScreeningList: FC = () => {
  const { alert, showLoader, hideLoader } = useUI()
  const [documents, setDocuments] = useState<ScreeningDocument[]>(INITIAL_DOCUMENTS)

  const handleUploadSimulation = (docId: string) => {
    // Trigger simulated animated upload
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, status: 'uploading', progress: 15 } : doc
      )
    )

    let currentProgress = 15
    const interval = setInterval(() => {
      currentProgress += 25
      if (currentProgress >= 100) {
        clearInterval(interval)
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId
              ? {
                  ...doc,
                  status: 'verified',
                  progress: 100,
                  uploadedFileName: `${doc.title.replace(/\s+/g, '_')}_Verified.pdf`,
                }
              : doc
          )
        )
        alert.success(
          'Document Uploaded',
          `Your document has been securely processed and queued for clearance.`
        )
      } else {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId ? { ...doc, progress: currentProgress } : doc
          )
        )
      }
    }, 280)
  }

  const handleRemoveDoc = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? { ...doc, status: 'idle', progress: 0, uploadedFileName: undefined }
          : doc
      )
    )
    alert.info('Document Removed', 'You can re-upload your updated screening document.')
  }

  const handleViewPreview = (doc: ScreeningDocument) => {
    showLoader(`Decrypting ${doc.title}...`)
    setTimeout(() => {
      hideLoader()
      alert.info(
        'Document Preview',
        `Viewing preview for verified credential: ${doc.uploadedFileName || doc.title}`
      )
    }, 600)
  }

  const totalUploaded = documents.filter((d) => d.status === 'verified').length
  const allVerified = totalUploaded === documents.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="w-full bg-[#1b0a33]/80 border border-[#3b1f66] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden backdrop-blur-md"
    >
      {/* 1. Header with Upload Icon & Instructional Text matching s4.png */}
      <div className="flex items-center gap-3.5 pb-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#38205c] border border-white/10 flex items-center justify-center text-gray-200 shrink-0">
          <HiOutlineCloudArrowUp className="w-5 h-5 text-gray-200" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm sm:text-base md:text-[17px] font-bold text-white tracking-tight leading-snug">
            Upload the required screening documents clearly and securely to complete your
            verification process.
          </h3>
        </div>
      </div>

      {/* Progress Overview Pill if partially uploaded */}
      {totalUploaded > 0 && (
        <div className="mt-5 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-300">
            Screening Progress: <strong className="text-white">{totalUploaded} of {documents.length}</strong> documents uploaded
          </span>
          <span className="font-mono text-emerald-400 font-semibold">
            {Math.round((totalUploaded / documents.length) * 100)}%
          </span>
        </div>
      )}

      {/* 2. Documents List matching s4.png */}
      <div className="mt-6 space-y-3.5 sm:space-y-4">
        {documents.map((doc, index) => {
          const isDone = doc.status === 'verified'
          const isUploading = doc.status === 'uploading'

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone
                  ? 'bg-[#150727] border-emerald-500/30'
                  : 'bg-[#140625] border-[#381f5e] hover:border-white/20'
              }`}
            >
              {/* Left Sub-Group: Red PDF Badge + Title + Progress Bar */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Red PDF Icon Badge matching s4.png */}
                <div className="w-10 sm:w-11 h-12 sm:h-13 bg-[#D92D20] rounded-xl flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                  <FaFilePdf className="w-5 h-5 text-white" />
                  <span className="text-[8px] font-extrabold tracking-tight uppercase leading-none mt-1">
                    PDF
                  </span>
                </div>

                {/* Title and Progress Row */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-white tracking-tight truncate">
                    {doc.title}
                  </h4>

                  {/* Upload Progress Bar and Percentage matching s4.png */}
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[11px] text-gray-400 font-normal whitespace-nowrap">
                      Upload Progress
                    </span>

                    {/* Progress Track */}
                    <div className="flex-1 max-w-xs h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isDone ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${doc.progress}%` }}
                      />
                    </div>

                    <span className="text-[11px] font-mono font-medium text-gray-300 w-8 text-right">
                      {doc.progress}%
                    </span>
                  </div>

                  {/* Uploaded Filename Tag */}
                  {isDone && doc.uploadedFileName && (
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                      <span className="truncate">{doc.uploadedFileName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sub-Group: Upload / Manage Action Buttons */}
              <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0">
                {!isDone && (
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => handleUploadSimulation(doc.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/10 active:bg-white/15 text-white text-xs sm:text-[13px] font-medium transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineCloudArrowUp className="w-4 h-4 text-gray-200" />
                        <span>Upload document</span>
                      </>
                    )}
                  </button>
                )}

                {isDone && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewPreview(doc)}
                      className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 transition cursor-pointer"
                      title="Preview uploaded document"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-white/10 transition cursor-pointer"
                      title="Remove / Re-upload document"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Complete Clearance Submission Button if all verified */}
      <AnimatePresence>
        {allVerified && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 pt-6 border-t border-white/10 flex justify-center"
          >
            <button
              type="button"
              onClick={() => {
                alert.success(
                  'Screening Dossier Submitted',
                  'All documents have been dispatched to the Admissions & Records board.'
                )
              }}
              className="py-4 px-10 rounded-full bg-[#FDE88C] hover:bg-[#FFE57A] text-[#160829] font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center gap-2"
            >
              <HiOutlineCheckCircle className="w-5 h-5 text-[#160829]" />
              <span>Submit for Final Clearance</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
