import { useSearchParams } from 'react-router';

const VerifyRoute = () => {
  const [searchParams] = useSearchParams();

  const isSuccess = searchParams.get('success');
  const message = searchParams.get('message');

  console.log(isSuccess);
  return (
    <div>
      <h2>Verify</h2>

      {isSuccess === 'true' ? <p>Success</p> : <p>Fail</p>}

      <p>{message}</p>
    </div>
  );
};

export default VerifyRoute;
