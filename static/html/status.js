function useFetch(url, defaultData) {
  const [data, updateData] = React.useState(defaultData)

  async function fetchData() {
    if (!url) {
      updateData(defaultData)
      return
    }

    const resp = await fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }
    })

    const json = await resp.json()
    updateData(json)
  }

  React.useEffect(() => {
    setInterval(() => {
      fetchData();
    }, 5000);
  } , [url]);

  return data;
}

function useFetchStatus() {
  // setInterval(() => {  // failed if setInterval is here
  const url = window.location.origin + "/status?url=" + window.location;
  const data = useFetch(url, {});

  return data.moddate;
  // }, 5000);
}

// function Example(props) {
function Status() {
  const [moddate_default, update] = React.useState(null)
  const moddate = useFetchStatus();

  if (!moddate_default && moddate) {
    update(moddate);
  } else if (moddate > moddate_default) {
    window.location.reload();
  };

  console.log(moddate);

  return (<div key={1000}>{ moddate }</div>)
}
