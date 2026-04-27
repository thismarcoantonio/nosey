import api from '@/api'

const SPREADSHEET_TITLE = 'nosey-database'
const SPREADSHEET_MIME = 'application/vnd.google-apps.spreadsheet'

export interface Sheet {
  id: string
  name: string
  url?: string
}

async function findExistingNoseyDatabase(): Promise<Sheet | null> {
  const q = `name='${SPREADSHEET_TITLE}' and mimeType='${SPREADSHEET_MIME}' and trashed=false`
  const res = await api.get<{ files?: { id: string; name: string; webViewLink?: string }[] }>(
    'https://www.googleapis.com/drive/v3/files',
    { params: { q, spaces: 'drive', fields: 'files(id,name,webViewLink)', pageSize: 1 } },
  )
  const file = res.data.files?.[0]
  if (!file) return null
  return { id: file.id, name: file.name, url: file.webViewLink }
}

async function createNoseyDatabase(): Promise<Sheet> {
  const { data } = await api.post<{
    spreadsheetId?: string
    properties?: { title?: string }
    spreadsheetUrl?: string
  }>('/spreadsheets', {
    properties: { title: SPREADSHEET_TITLE },
  })
  const id = data.spreadsheetId
  if (!id) throw new Error('Create spreadsheet response missing spreadsheetId')
  return {
    id,
    name: data.properties?.title ?? SPREADSHEET_TITLE,
    url: data.spreadsheetUrl,
  }
}

export async function ensureNoseyDatabase(): Promise<{ sheet: Sheet; created: boolean }> {
  const existing = await findExistingNoseyDatabase()
  if (existing) return { sheet: existing, created: false }
  const sheet = await createNoseyDatabase()
  return { sheet, created: true }
}

export async function fetchSpreadsheetRows(spreadsheetId: string): Promise<string[][]> {
  const metaRes = await api.get<{ sheets?: { properties?: { title?: string } }[] }>(
    `/spreadsheets/${encodeURIComponent(spreadsheetId)}`,
    { params: { fields: 'sheets(properties(title))' } },
  )
  const firstTitle = metaRes.data.sheets?.[0]?.properties?.title ?? 'Sheet1'
  const range = `'${firstTitle}'!A1:E1`
  const valuesRes = await api.get<{ values?: string[][] }>(
    `/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`,
  )
  return valuesRes.data.values ?? []
}

export async function appendRows(spreadsheetId: string, values: string[][]): Promise<void> {
  const range = 'Sheet1'
  await api.post(
    `/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append`,
    { values },
    { params: { valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS' } },
  )
}
