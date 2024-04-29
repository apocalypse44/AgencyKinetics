import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearErrors, deleteQuote } from '../../actions/quoteAction';
import { DELETE_QUOTE_RESET } from '../../constants/quoteConstants';

const QuotesCard = ({ quote, history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error } = useSelector((state) => state.quotes);
  const { error: deleteError, isDeleted } = useSelector((state) => state.quoteDU);

  const [serviceNamesMap, setServiceNamesMap] = useState({});

  const deleteQuoteHandler = (id) => {
    dispatch(deleteQuote(id));
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await fetch(`/test/v1/services`);
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }
        const data = await response.json();
        console.log('Services data:', data);

        const serviceMap = {};
        data.services.forEach((service) => {
          serviceMap[service._id] = service.service_name;
        });

        setServiceNamesMap(serviceMap);
      } catch (error) {
        console.error('Error fetching services:', error.message);
      }
    };

    fetchServiceData();
  }, []);
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success('Quote deleted successfully');
      history.push('/quotes');
      dispatch({ type: DELETE_QUOTE_RESET });
    }
  }, [dispatch, alert, error, isDeleted, history, deleteError]);
  const createdAtDate = new Date(quote.createdAt);
  const year = createdAtDate.getFullYear();
  const month = createdAtDate.toLocaleString('en-us', { month: 'short' });
  const day = createdAtDate.getDate();
  const formattedDate = `${year}-${month}-${day}`;

  return (
    <div>
      <Link className='quoteCard' to={`/quote/${quote._id}`}>
        <p>{quote.quoteId}</p>

      </Link>
      <p>{serviceNamesMap[quote.serviceId]}</p>
      <p>{quote.selected}</p>
      <p>{formattedDate}</p>
      <p>{quote.budget}</p>
      <button>
        <Link to={`/quote/update/${quote._id}`}>Update</Link>
      </button>
      <button onClick={() => deleteQuoteHandler(quote._id)}>Delete</button>
      <hr />
    </div>
  );
};

export default QuotesCard;