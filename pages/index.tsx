import { Container, Text, List } from '@mantine/core';
import { renderPageTitle } from 'lib/utils';

export default function Index() {
  return (
    <Container size="xl">
      {renderPageTitle('Home')}
      <Text>Todo</Text>
      <List>
        Fraud List
        <List.Item>fix (or reload) data after first update</List.Item>
        <List.Item>view previous picks</List.Item>
        <List.Item>ladder page</List.Item>
        <List.Item>think about how to arch the submission and stuff</List.Item>
        User Management
        <List.Item>invite a friend page</List.Item>
        <List.Item>forgot password</List.Item>
        Profile
        <List.Item>Profile page</List.Item>
        Content
        <List.Item>users can create content</List.Item>
        Home
        <List.Item>simple home page</List.Item>
        <List.Item>fill out footer</List.Item>
        Admin
        <List.Item>submit week results</List.Item>
        Tech Debt
        <List.Item>deploy the thing</List.Item>
        <List.Item>clean up types</List.Item>
        <List.Item>get radix colours in</List.Item>
        <List.Item>tweak theme for fun</List.Item>
        <List.Item>migrate to @tabler/react</List.Item>
        <List.Item>migrate to a backend or graphql</List.Item>
        prod readiness
        <List.Item>analytics (plausible? splitbee?)</List.Item>
        <hr></hr>maybe done
        <hr></hr>done
        <List.Item>favicon</List.Item>
        <List.Item>edit settings</List.Item>
        <List.Item>animation/feedback on submit/update</List.Item>
        <List.Item>
          setup week strategy, when week starts, when games start
        </List.Item>
        <List.Item>basic signup page</List.Item>
        <List.Item>picks page</List.Item>
        <List.Item>user roles</List.Item>
        <List.Item>logout error?</List.Item>
        <List.Item>already logged in on /login or /signup</List.Item>
      </List>
    </Container>
  );
}
