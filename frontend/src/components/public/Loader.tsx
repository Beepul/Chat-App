import Lottie from 'lottie-react'
import animationData from '../../assets/animations/loading.json'

const Loader = () => {

  return (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
        width={200}
        height={200}
        style={{maxHeight: '200px', maxWidth: '200px'}}
      />
    </div>
  )
}

export default Loader