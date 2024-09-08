import React from 'react'

function Container({children, className}) {
  return (
    <div className={`${className}flex max-w-7xl h-10`}>{children}</div>
  )
}

export default Container