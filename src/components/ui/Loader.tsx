import React from 'react';
import '../css/Loader.css';

interface LoaderProps {
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className='loader-overlay'>
      <div className='loader-container'>
        <div className='dot dot1' />
        <div className='dot dot2' />
        <div className='dot dot3' />
      </div>
    </div>
  );
};

export default Loader;
