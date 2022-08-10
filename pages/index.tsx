import { Container, Text, List } from '@mantine/core';

export default function Subgrid() {
  return (
    <Container>
      <Text>Todo</Text>
      <List>
        <List.Item>animation/feedback on submit/update</List.Item>
        <List.Item>picks page</List.Item>
        <List.Item>user roles</List.Item>
        <List.Item>edit settings</List.Item>
        <List.Item>Profile page</List.Item>
        <List.Item>clear edit/picking state (last updated)</List.Item>
        <List.Item>basic signup page</List.Item>
        <List.Item>admins can create content</List.Item>
        <List.Item>simple home page</List.Item>
        <List.Item>fill out footer</List.Item>
        <List.Item>view previous picks</List.Item>
        <List.Item>invite a friend page</List.Item>
        <List.Item>clean up types</List.Item>
        <List.Item>forgot password</List.Item>
        <hr></hr>maybe done
        <List.Item>already logged in on /login or /signup</List.Item>
        <List.Item>logout error?</List.Item>
      </List>
    </Container>
  );
}
