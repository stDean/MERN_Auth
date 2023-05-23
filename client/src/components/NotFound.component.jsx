import React from 'react'

function NotFound() {

  const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '3em',
    fontWeight: 800,
    minHeight: 'calc(100vh - 200px)'
  }

  return (
    <div style={styles}>
      404 | Not Found
    </div>
  )
}

export default NotFound