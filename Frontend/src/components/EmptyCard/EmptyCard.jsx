import React from 'react'

function EmptyCard({img, message}) {
  return (
    <div className='flex flex-col mt-20 items-center justify-center'>
      <img className='w-40 h-40' src={img} alt="" />
      <p className='w-1/2 font-semibold text-center leading-7 mt-5'>{message}</p>
    </div>
  )
}

export default EmptyCard