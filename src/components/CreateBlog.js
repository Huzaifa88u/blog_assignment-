import axios from "axios";
import Header from "./header";
import Field from "./Field";
import "./Blog.css";
import React, { useEffect, useState } from "react";
import { Form } from "reactstrap";
import { Col, FormGroup, Label, Input, Button } from "reactstrap";
import {
  BrowserRouter as Router,
  Link,
  useLocation,
  useHistory,
} from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}
export default function CreateBlog() {
  const [value_title, setTitle] = useState("");
  const [value_body, setBody] = useState("");
  const query = useQuery();
  const history = useHistory();

  useEffect(() => {
    // console.log(query.get("userid"));
  });

  const addBlog = async (e) => {
    e.preventDefault();
    console.log(e);
    const blog = {
      userId: query.get("userid"),
      Title: value_title,
      content: value_body,
      time: Date.now(),
    };
    const token = await axios
      .post("http://localhost:3000/blogs/createblog", blog)
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          history.push({
            pathname: "/blogs",
            search: `?userid=${query.get("userid")}`,
          });
        }
      });
  };

  const fetchBlog = async () => {
    const token = axios
      .get(`http://localhost:3000/blogs/blog/${query.get("blogid")}`)
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        if (res.data) {
          setTitle(res.data[0].Title);
          setBody(res.data[0].content);
          console.log(value_body);
        } else {
          alert("Error fetching blog");
        }
      });
  };

  useEffect(() => {
    console.log(query.get("edit"));
    if (query.get("edit")) {
      fetchBlog();
    }
  }, []);

  const editBlog = async (e) => {
    e.preventDefault();
    console.log("edit");
    const blog = {
      userId: query.get("userid"),
      Title: value_title,
      content: value_body,
      time: Date.now(),
    };
    const token = axios
      .put(`http://localhost:3000/blogs/editblog/${query.get("blogid")}`, blog)
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          console.log("successful update");
          history.push({
            pathname: "/blogs ",
            search: `?userid=${query.get("userid")}`,
          });
        }
      });
  };

  return (
    <Form onSubmit={!query.get("edit") ? addBlog : editBlog}>
      <FormGroup col>
        <Label for="title" sm={2} size="lg">
          Title
        </Label>
        <Col sm={10}>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            name="title"
            value={query.get("edit") ?? value_title}
            id="title"
            placeholder="Blog''s Title"
            bsSize="lg"
          />
        </Col>
        <Label for="body" sm={2} size="lg">
          Content
        </Label>
        <Col sm={10}>
          <Input
            onChange={(e) => setBody(e.target.value)}
            type="text"
            name="body"
            id="body"
            value={query.get("edit") ?? value_body}
            placeholder="Write here..."
            bsSize="lg"
          />
        </Col>
        <Button type="submit">Submit</Button>
      </FormGroup>
    </Form>
  );
}
