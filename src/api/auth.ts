const OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
].join(' ')

export function requestAccessToken(
  clientId: string,
): Promise<google.accounts.oauth2.TokenResponse> {
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: OAUTH_SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          reject(
            new Error(
              tokenResponse.error_description || tokenResponse.error || 'OAuth token error',
            ),
          )
          return
        }
        resolve(tokenResponse)
      },
    })
    client.requestAccessToken({ prompt: '' })
  })
}
