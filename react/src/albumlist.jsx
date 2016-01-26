const keys = {
  restDb: '56a7e95ff735025c5e98ec80',
};

const Album = ({title, artists}) => (
    <div>
      <h2>{title} by {artists.map(artist => artist.name).join(', ')}</h2>
    </div>
);

const AlbumList = ({albums}) => {
  return (
      <div>
        {albums.map(album => (<Album key={album._id} {...album}/>))}
      </div>
  );
};

const TheAlbums = ({title, data}) => (
    <div className="container">
      <h1>{title}</h1>
      <AlbumList albums={data}/>
    </div>
);

const Promised = (propName, Decorated) => class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
    };
  }

  componentDidMount() {
    this.props.promise
        .then(response => response.json())
        .then(data => this.setState({
          loading: false,
          data,
        }));
  }

  render() {
    const { loading, data, } = this.state;

    if (loading) {
      return <div>Loading…</div>;
    }

    // Don't pass the promise prop along.
    const { promise, ...propsSansPromise } = this.props;
    return <Decorated data={data} {...propsSansPromise}/>;
  }
};

const fetchAlbums = () => fetch('https://the-albums.restdb.io/rest/albums', {
  headers: new Headers({
    'Content-Type': 'application/json',
    'x-apikey': keys.restDb,
  }),
});

const TheAlbumsWithData = Promised("albums", TheAlbums);

ReactDOM.render((
    <TheAlbumsWithData title="FUNKY ALBUMS!" promise={fetchAlbums()}/>
), document.getElementById('container'));
