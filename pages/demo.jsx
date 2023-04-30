import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'

let childWindow

const receiveDataFromChild = (data) => {
  console.log('接收到来自子窗口的数据：', data);
  if (data?.transactionId) {
    localStorage.setItem('txId', data?.transactionId)
    console.log('缓存 tx')
    location.reload();
  }
}

const DemoPage = () => {
  // const router = useRouter()
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const txId = localStorage.getItem('txId')
    if (!txId) {
      // window.open('/')
      childWindow = window.open('/?amount=0.01&currencyCode=CNY&destination=oakerx&businessName=demo', 'myWindow', 'width=800,height=600');
      window.receiveDataFromChild = receiveDataFromChild;
      childWindow.opener = window;
    } else {
      setIsUnlocked(true)
    }
  }, [setIsUnlocked])

  return (
    <div>
      <h3>页面有一些需要支付才能使用的功能，状态: {isUnlocked ? '已支付解锁' : '待支付'}</h3>
    </div>
  )
}

export default DemoPage
