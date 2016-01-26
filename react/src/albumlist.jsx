const keys = {
  restDb: '56a80496f735025c5e98ec98',
};

const headers = new Headers({
  'Content-Type': 'application/json',
  'x-apikey': keys.restDb,
});

const Album = ({title, artists}) => (
    <div>
      <p>{title} by {artists.map(artist => artist.name).join(', ')}</p>
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
    <div>
      <h1>{title}</h1>
      <AlbumList albums={data}/>
    </div>
);

const Promised = Decorated => class extends React.Component {
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
  headers,
});

const TheAlbumsWithData = Promised(TheAlbums);

const ArtistSummary = ({name}) => (
    <div>
      <p>{name}</p>
    </div>
);

const TheArtists = ({data}) => (
    <div>
      <h1>Artists</h1>
      {data.map(artist => <ArtistSummary key={artist._id} {...artist}/>)}
    </div>
);

const fetchArtists = () => fetch('https://the-albums.restdb.io/rest/artists', {
  headers,
});

const TheArtistsWithData = Promised(TheArtists);

const App = (props) => (
    <div className="container">
      <TheAlbumsWithData title="FUNKY ALBUMS!" promise={fetchAlbums()}/>
      <hr/>
      <TheArtistsWithData promise={fetchArtists()}/>
    </div>
);

ReactDOM.render((
    <App/>
), document.getElementById('container'));
