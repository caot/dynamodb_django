const useHttp = (url, defaultData) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState(null)

  const fetchData = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }
    })
    .then(response => {
      console.log(response)
      if (response.ok) {
        const json = response.json()
        return json;
      } else {
        throw new Error('Failed to fetch.');
      }
    })
    .then(data => {
      setIsLoading(false);
      setData(data);
    })
    .catch(err => {
      console.log(err);
      setIsLoading(false);
    });
  }

  // It's important that we pass in url as the last parameter in useEffect. It
  // ensures the fetch call is only trigged once when url changes.
  React.useEffect(() => {
    setInterval(() => {
      fetchData();
    }, 5000);
  } , [url]);

  return [isLoading, data];
}

// function useFetchStatus() {
const useFetchStatus = () => {
  // setInterval(() => {  // failed if setInterval is here
  const [isLoading, data] = useHttp(window.location.origin + "/status?url=" + window.location, []);

  return data !== null ? data.moddate : null;
  // }, 5000);
}

// function Status() {
const Status = () => {
  const [moddate_default, update] = React.useState(null)
  const moddate = useFetchStatus();

  if (!moddate_default && moddate) {
    update(moddate);
  } else if (moddate > moddate_default) {
    window.location.reload();
  };

  // console.log(moddate);

  return (<div key={1000}>{ moddate }</div>)
}
