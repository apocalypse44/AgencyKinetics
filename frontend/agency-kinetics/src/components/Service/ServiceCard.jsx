import React, { useEffect,Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Link} from "react-router-dom";
import { clearErrors, deleteService } from '../../actions/serviceAction';
import { useAlert } from 'react-alert';
import { DELETE_SERVICE_RESET } from '../../constants/serviceConstant';
import "./ServiceCard.css" 
import Loader from "../layout/Loader/Loader"
import car from "../../Images/car.jpg"

const ServiceCard = ({service,  history}) => {
const alert = useAlert();
const dispatch = useDispatch();

const {error, loader} = useSelector(state=>state.services)
const {error : deleteError , isDeleted} = useSelector(state=>state.serviceDU)
const [imageSrc, setImageSrc] = useState(null);
console.log(service)
const deleteServiceHandler= (id)=>{
dispatch(deleteService(id));
  }

  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearErrors())
    }
    if (deleteError){
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if(isDeleted){
      alert.success("Service deleted Succeccfully")
    history.push("/services");
      dispatch({type:DELETE_SERVICE_RESET})
    }
    if (service.service_cover_img) {
      console.log(service.service_cover_img.data)
      const uint8Array = new Uint8Array(service.service_cover_img.data.data);
      const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
      const imageUrl = `data:${service.service_cover_img.contentType};base64,${btoa(base64String)}`;
      // const imageUrl = URL.createObjectURL(new Blob([service.service_cover_img.data]));
      // console.log(imageUrl)

      setImageSrc(imageUrl);
    }
  }, [dispatch, alert, error, isDeleted, history , deleteError, service.service_cover_img])
  
  return (
    <div >
{loader ? (<Loader/>) :(<Fragment>
       <div className="main-content">
      <div className="card-container">
      <div className="card">
      {imageSrc ? (
        <img src={imageSrc} alt={service.service_name} className="card-image" />
      ) : (
        <img src={car} alt="Car" className="card-image" />
      )}         
            <div className="card-content">
              <h3 className="card-name">{service.service_name}</h3>
              <p className="card-description">{service.aboutdesc}</p>
              <p className="card-to">{service.aboutto}</p>
              <button className="learn-more-button">Learn More</button>
            </div>
          </div>
      </div>
    </div>
          <button>
 <Link to={`/service/update/${service._id}`}>
          Update
            </Link>
          </button>

            <button
              onClick={() =>
                   deleteServiceHandler(service._id)
              }
            >
              Delete 
            </button>
<hr></hr>
</Fragment>)}
    </div>
  )
}

export default ServiceCard