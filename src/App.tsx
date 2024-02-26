import { useState, FormEvent } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export function AlbumPicker() {
  const [albums, setAlbums] = useState<string[]>([]);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      artist: { value: string };
    };
    console.log(formElements.artist.value);
    const artist = encodeURIComponent(formElements.artist.value);
    // const target = e.target as typeof e.target & {
    //   artist: { value: string };
    // };
    // const artist = encodeURIComponent(target.artist.value);
    const url = `https://musicbrainz.org/ws/2/release?fmt=json&query=artist:${artist}`;
    console.log({url})
    const responsePromise = fetch(url);
    // ...
    const response = await responsePromise;
    const mbResult = (await response.json()) as {
      releases: { title: string }[];
    };
    // console.log('mbResult', mbResult);
    const { releases } = mbResult;
    setAlbums(releases.map(({ title }) => title));
  }
  return (
    <form name="search" onSubmit={handleSubmit} aria-label="search">
      <label>
        Artist name:
        <input name="artist" />
      </label>
      <button type="submit">Search</button>
      <p>Albums:</p>
      <ol>
        {albums.map((album) => (
          <li>{album}</li>
        ))}
      </ol>
    </form>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite and React</h1>
      <div className="card">
        <AlbumPicker />
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
