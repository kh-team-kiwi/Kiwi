import errorimage from '../../images/default-image.png'

const ErrorImageHandler =  (event) => {
    event.target.src = errorimage;
    event.target.onError=null;
}
export default ErrorImageHandler;