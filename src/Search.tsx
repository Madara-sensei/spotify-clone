import { useEffect, useState } from "react";
import "./styles/Search.css";
import db from "./firebase";
import SongItem from "./components/SongItem";
import { useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import ExplicitIcon from "@material-ui/icons/Explicit";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ClearIcon from "@material-ui/icons/Clear";

function Search() {
  const [titles, setTitles] = useState<any>([]);
  const input = useAppSelector((state: RootState) => state.search.input);
  const [results, setResults] = useState<any>([]);
  const [bestResult, setBestResult] = useState<any>({});
  const [recentSearch, setRecentSearch] = useState<any>([]);
  useEffect(() => {
    db.collection("songs").onSnapshot((snapshot) => {
      setTitles(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data(),
        }))
      );
    });
   
    db.collection("artists").onSnapshot((snapshot) => {
      setRecentSearch(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

     const regex = new RegExp(input.toLowerCase());
    setResults(
      titles.filter(
        ({ title }) =>
          title.name.toLowerCase().match(regex) ||
          title.artist.toLowerCase().match(regex)
      )
    );
    setBestResult(results[0]);
    console.log("effect");
    

  }, [input]);

 

  const GenreItem = ({ img, name, color }) => {
    return (
      <div className="genreItem" style={{ backgroundColor: color }}>
        <h1>{name}</h1>
        <img src={img} alt="" />
      </div>
    );
  };
  const RecentSearchItem = ({ id, name, img }) => {
    return (
      <div className="recentSearchItem">
        <ClearIcon />
        <img src={img} alt="" />

        <button className="search__recentSearchItem__play">
          <PlayArrowIcon />
        </button>
        <h4>{name}</h4>
        <p>Artist</p>
      </div>
    );
  };
  return (
    <div className="search">
      <div className="search__container">
        {input && bestResult ? (
          <div className="search__mainResult">
            <div className="search__bestResult">
              <h2>Best result</h2>
              {bestResult && (
                <div className="search__bestResultItem">
                  <img src={bestResult.title?.img} alt="" />

                  <h1>{bestResult.title?.name.substring(0, 14) + "..."}</h1>

                  <div className="search__bestResultItem__info">
                    <ExplicitIcon />
                    <p>{bestResult.title?.artist}</p>
                    <h3>title</h3>
                    <button className="search__bestResultItem__play">
                      <PlayArrowIcon fontSize="large" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="search__songsResults">
              <h2>Titles</h2>
              {results &&
                results.map(({ id, title }) => {
                  return (
                    <SongItem
                      key={id}
                      isInTheLikedSongs={false}
                      id={id}
                      name={title.name}
                      artist={title.artist}
                      img={title.img}
                      duration={title.duration}
                    />
                  );
                })}
            </div>
          </div>
        ) : (
          <>
            <div className="search__recentSearch">
              <h2>Recent Search</h2>
              <div className="search__recentSearchItems">
                {recentSearch.map(({ id, data }) => {
                  return (
                    <RecentSearchItem
                      key={id}
                      id={id}
                      img={data.img}
                      name={data.name}
                    />
                  );
                })}
              </div>
            </div>
            <div className="search__favoriteGenres">
              <h2>Your favorite genres</h2>
              <div className="search__favoriteGenresItem">
                <GenreItem
                  color="rgb(186, 93, 7)"
                  img="https://i.scdn.co/image/ab67706f000000029bb6af539d072de34548d15c"
                  name="Hip-hop"
                />
                <GenreItem
                  color="rgb(230, 30, 50)"
                  img="https://i.scdn.co/image/ab67706f00000002fe6d8d1019d5b302213e3730"
                  name="Rock"
                />
                <GenreItem
                  color="rgb(141, 103, 171)"
                  img="https://t.scdn.co/images/0a74d96e091a495bb09c0d83210910c3"
                  name="Pop"
                />
                <GenreItem
                  color="rgb(45, 70, 185)"
                  img="https://t.scdn.co/images/ab71e150e8ac4c179fdcef7267e5453b.jpeg"
                  name="French variety"
                />
              </div>
            </div>
            <div className="search__browse">
              <h2>Browse All</h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
