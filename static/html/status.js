var moddate_default = null;

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      moddate: null
    };
  }

  componentDidMount() {
    setInterval(() => {

      fetch("/status?url=" + window.location, {
          headers: {
          // https://stackoverflow.com/questions/35192841/fetch-post-with-multipart-form-data
          // DO NOT supply headers with 'Content-Type' if it's using FormData
          // 'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          // Accept: 'application/json'
          }
        }
      )
      .then(res => res.json())
      .then(
        (result) => {
//            console.log(result);

          this.setState({
            isLoaded: true,
            moddate: result.moddate
          });

          if (null === moddate_default) {
            moddate_default = result.moddate;
          } else if (result.moddate > moddate_default) {
            location.reload();
          };
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error
          });
        }
      );


    }, 5000);
  }

  render() {
    const { error, isLoaded, moddate } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (<div key={1000}>{ moddate }</div>
      );
    }
  }
}
