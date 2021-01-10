import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  CardDeck,
  Button,
  Form,
  FormControl
} from "react-bootstrap";
import SingleCard from "./Card";
import { movieAPI as API } from "../../API";
const MainCards = (props) => {
  const [mov, setMov] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  useEffect(() => {
    fetch(`${API.movie}${API.key}&page=1`)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.results);
        setMov(res.results);
      });
  }, []);
  const loadMore = (e) => {
    e.preventDefault();
    if (searched) {
      fetch(`${API.search}${searchQuery}&page=${searchIndex + 1}`)
        .then((res) => res.json())
        .then((res) => {
          let movies = [...mov];
          let newMovs = movies.concat(res.results);
          setMov(newMovs);
          setSearchIndex(searchIndex + 1);
        });
    } else {
      fetch(`${API.movie}${API.key}&page=${pageIndex + 1}`)
        .then((response) => response.json())
        .then((res) => {
          console.log(res.results);
          let movies = [...mov];
          let newMovs = movies.concat(res.results);
          setMov(newMovs);
          setPageIndex(pageIndex + 1);
        });
    }
  };
  const searchMovs = (e) => {
    e.preventDefault();
    if (searchQuery === "") {
      setShowError(true);
    } else {
      setShowError(false);
      fetch(`${API.search}${searchQuery}&page=${searchIndex}`)
        .then((res) => res.json())
        .then((res) => {
          setMov(res.results);
          setSearched(true);
        });
    }
  };
  const [error, setShowError] = useState(false);
  const [searchIndex, setSearchIndex] = useState(1);
  const [searched, setSearched] = useState(false);
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Container>
      <Row>
        <Form inline className="mx-auto mt-3" onSubmit={searchMovs}>
          <FormControl
            type="text"
            placeholder="Search"
            name="search"
            onChange={handleChange}
            value={searchQuery}
            className="mr-sm-2"
            maxLength="15"
          />

          <Button variant="outline-success" className="my-auto" type="submit">
            Search
          </Button>
        </Form>
      </Row>
      {error ? (
        <>
          <p className="mx-auto text-danger m-1">Must Enter A Search Term</p>
        </>
      ) : (
        ""
      )}
      <CardDeck>
        {mov[0] &&
          mov.map((item, index) => {
            return (
              <SingleCard
                title={item.title}
                img={`${API.image}${item.backdrop_path}`}
                key={item.id}
                id={item.id}
              />
            );
          })}
      </CardDeck>
      <Button variant="outline-dark" className="my-3" onClick={loadMore}>
        Load More
      </Button>
    </Container>
  );
};

export default MainCards;
