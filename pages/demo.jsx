import { useEffect, useState } from 'react'

let childWindow

const receiveDataFromChild = (data) => {
  console.log('接收到来自子窗口的数据：', data);
  if (data?.transactionId) {
    localStorage.setItem('txId', data?.transactionId)
    console.log('缓存 tx')
    location.reload();
  }
}

const goPay = () => {
  const params = {
    sendAmount: '0.01',
    currencyCode: 'CNY',
    destination: 'oakerx',
    businessName: 'Demo Store'
  };

  const queryString = new URLSearchParams(params).toString();
  childWindow = window.open(`/?${queryString}`, 'myWindow', 'width=800,height=600');
  window.receiveDataFromChild = receiveDataFromChild;
  childWindow.opener = window;
}

const DemoPage = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const txId = localStorage.getItem('txId')
    if (!txId) {
    } else {
      setIsUnlocked(true)
    }
  }, [setIsUnlocked])

  return (
    <div>
      <h3 className='m-5'>页面有一些需要支付才能使用的功能，状态: {isUnlocked ? '已支付' : '等待支付'}</h3>
      <button type="button" className="m-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={goPay}
      >
        去支付
      </button>
    </div>
  )
}

export default DemoPage
