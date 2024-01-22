import './navbar.css';
import braga from '../assets/bragaLogo.png';

function Navibar() {
    return (
        <div className="heading flex">
          <div className='mx-auto mt-3 mb-3'>
        <span className=' inline-block'>
        <img className='h-8 ' src={braga} alt="Braga Technology Logo"/>
        </span>
        <h1 className='text-2xl font-bold inline-block ms-4 align-top'>Braga 3D </h1>
        </div>
      
        </div>
      )
}

export default Navibar