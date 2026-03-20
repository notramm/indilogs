import LoadingGif from '../images/loading.gif'

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader_image">
        <img src={LoadingGif} alt="Loading..." />
      </div>
    </div>
  )
}

export default Loader