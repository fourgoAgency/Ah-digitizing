import React from 'react';

export default function Label({ text, classname }: { text: string , classname?: string}) {
  return (
    <>
    <div className={"inline-flex items-center py-1.5 text-gray-500 uppercase bg-white rounded-4xl border-0" + (classname ? ` ${classname}` : '')}>
      <div className="rounded-full bg-teal-500 w-3 h-3 ml-3"></div>
      <p className="text-sm mx-3">{text}</p>
      <div className="rounded-full bg-teal-500 w-3 h-3 mr-3"></div>
    </div>
  </>
  );
}