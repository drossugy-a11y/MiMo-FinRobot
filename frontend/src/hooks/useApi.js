import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

export function useReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = useCallback(async (signal) => {
    try {
      setLoading(true)
      const response = await api.get('/reports/', { signal })
      setReports(response.data.reports || [])
      setError(null)
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchReports(controller.signal)
    return () => controller.abort()
  }, [fetchReports])

  return { reports, loading, error, refetch: fetchReports }
}

export function useReport(id) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReport = useCallback(async (signal) => {
    if (!id) return
    try {
      setLoading(true)
      const response = await api.get(`/reports/${id}`, { signal })
      setReport(response.data)
      setError(null)
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    const controller = new AbortController()
    fetchReport(controller.signal)
    return () => controller.abort()
  }, [fetchReport])

  return { report, loading, error }
}

export function useBacktests(reportId = null) {
  const [backtests, setBacktests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBacktests = useCallback(async (signal) => {
    try {
      setLoading(true)
      const params = reportId ? { report_id: reportId } : {}
      const response = await api.get('/backtests/', { params, signal })
      setBacktests(response.data || [])
      setError(null)
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [reportId])

  useEffect(() => {
    const controller = new AbortController()
    fetchBacktests(controller.signal)
    return () => controller.abort()
  }, [fetchBacktests])

  return { backtests, loading, error, refetch: fetchBacktests }
}

export async function uploadReport(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/reports/upload', formData)
  return response.data
}

export async function processReport(reportId) {
  const response = await api.post(`/reports/${reportId}/process`)
  return response.data
}

export async function createBacktest(data) {
  const response = await api.post('/backtests/', data)
  return response.data
}

export async function runBacktest(backtestId) {
  const response = await api.post(`/backtests/${backtestId}/run`)
  return response.data
}

export async function getBacktestResult(backtestId) {
  const response = await api.get(`/backtests/${backtestId}/result`)
  return response.data
}

export async function deleteReport(reportId) {
  const response = await api.delete(`/reports/${reportId}`)
  return response.data
}
