const API_KEY = "http://www.omdbapi.com/?i=tt3896198&apikey=cb63ad37";
const BASE_URL = "http://www.omdbapi.com/";

async function fetchFromOMDB(params) {
  const query = new URLSearchParams({ ...params, apikey: API_KEY });
  const url = `${BASE_URL}?${query.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function OMDBSearchByPage(search, page = 1) {
  const data = await fetchFromOMDB({ s: search, page });
  if (data.Response === "True") {
    return data.Search;
  }
  return [];
}

export async function OMDBSearchComplete(search) {
  let allResults = [];
  let page = 1;
  while (true) {
    const results = await OMDBSearchByPage(search, page);
    if (results.length === 0) break;
    allResults = allResults.concat(results);
    page++;
    if (results.length < 10) break; // OMDB devuelve máximo 10 resultados por página
  }
  return allResults;
}

export async function OMDBGetByImdbID(imdbID) {
  const data = await fetchFromOMDB({ i: imdbID });
  if (data.Response === "True") {
    return data;
  }
  return null;
}
