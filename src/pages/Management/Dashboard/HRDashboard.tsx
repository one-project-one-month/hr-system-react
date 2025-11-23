import { FullDonutChart } from '@/components/ui/donutchart';
import PieChartWithPercentage from '@/components/ui/piechartwithpercentage';
import { UsersRound } from 'lucide-react';
import { useCurrentLocation } from '@/components/ui/current-location';

/* eslint-disable react-refresh/only-export-components */
export default function () {
  const { position, error, loading, requestLocation } = useCurrentLocation();

  return (
    <>
      <div className='flex flex-col gap-2 p-3 w-full h-auto'>
        <div className='w-full flex flex-col md:flex-row gap-2'>
          <div className='w-full md:w-[50%] bg-natural-50 p-2 rounded-xl shadow-sm flex flex-col justify-center md:justify-between'>
            <p className='text-text font-medium text-xl'>Check In/Out</p>
            <p className='text-aqua font-bold text-xl'>
              latitude : {position?.latitude}
            </p>
            <p className='text-aqua font-bold text-xl'>
              longitude : {position?.longitude}
            </p>
            <button
              onClick={() => {
                requestLocation();
                console.log(position);
              }}
              className='flex items-center justify-end flex-col gap-2 flex-1'>
              <div className='checkin-circle flex items-center justify-center'>
                <p className='text-white font-bold text-xl'>Check In</p>
              </div>
              <div className='flex items-center justify-center flex-col gap-2'>
                <div>
                  <p>20/Oct/2025</p>
                </div>
                <p className='font-bold pb-2'>
                  Check In: ------ | check Out: ------
                </p>
              </div>
            </button>
          </div>
          <div className='w-full md:w-[50%]'>
            <PieChartWithPercentage />
          </div>
        </div>
        <div className='bg-natural-50 rounded p-3'>
          <div className='flex justify-between'>
            <p className='text-xl font-medium'>Attendance Overview</p>
            <div className='p-2 bg-primary-50 text-primary-500 rounded'>
              <p>Today</p>
            </div>
          </div>
          <div className='flex gap-3 w-full text-primary-700 flex-col md:flex-row'>
            <div className='bg-primary-100 p-2 rounded w-60 flex flex-col w-full md:w-[40%] mt-2'>
              <div className='flex justify-between w-full '>
                <p className='font-bold '>Total Employee</p>
                <UsersRound />
              </div>
              <div className='font-bold text-4xl pt-5'>
                <p>250</p>
              </div>
            </div>
            <div className='w-full'>
              <FullDonutChart
                values={[40, 25, 15]}
                colors={['#02B16C', '#FFDF20', '#E7000B']}
                size={120}
                strokeWidth={10}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
