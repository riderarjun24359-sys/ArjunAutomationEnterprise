import React from 'react'

export default function Page() {
  return (
    <div>
      <h1>Welcome to My Next.js App!</h1>
      <p>This is the main page.</p>
      <button onClick={() => window.location.href = '/about'}>Go to About</button>
    </div>
  )
}