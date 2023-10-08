'use client';
import { HeaderMegaMenu } from '@/components/Header';
import {
  Button,
  Container,
  Flex,
  Image,
  Stack,
  Text,
  Title,
  Group,
  TypographyStylesProvider,
  Paper,
  Grid,
  LoadingOverlay,
  Avatar,
} from '@mantine/core';
import { IconCalendar, IconMapPin } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

export default function EventsPage({ params }) {
  const [event, setEvent] = useState<any[]>();
  const [user, setUser] = useState<any[]>();

  async function fetchEvent() {
    const res = await fetch(`/api/events/${params.id}`);
    const e = (await res.json()).event;
    setEvent(e);
  }
  useEffect(() => { 
    fetchEvent();
  }, []);
  useEffect(() => {
    async function b() {
        const session = await getSession()
        console.log(session)
        if (session){
            setUser(session.user.id)
        }
    }
    b();
  }, []);
  const demoProps = {
    bg: 'var(--mantine-color-blue-light)',
    h: 400,
    mt: 'md',
  };
  
  const [registering, setRegistering] = useState(false)

  const registerUser = async () => {
    const res = await fetch(`/api/events/${params.id}/register`)
    const event = (await res.json()).event
    setEvent(event)
  }

  return (
    <>
      <HeaderMegaMenu></HeaderMegaMenu>
      <Paper shadow="md" m={'8em'}>
        <LoadingOverlay
          visible={!event}
          zIndex={1000}
          overlayProps={{ radius: 'sm', backgroundOpacity: 1 }}
          loaderProps={{ type: 'dots' }}
        />
        <Flex direction={'column'} gap={'2em'}>
          <Grid>
            <Grid.Col span={8}>
              <Image src={event?.banner}></Image>
            </Grid.Col>
            <Grid.Col span={4}>
              <Stack justify="space-between" h="100%" pr={'1em'} pt={'1em'}>
                <div>
                  <Title order={2}>{event?.name}</Title>
                  <Text size="xs" c="gray" mb="1em">
                    {event?.hostedBy.map((h) => h.name).join(', ')}
                  </Text>
                  <Flex gap={'0.4em'} direction={'column'}>
                    <Group>
                      <Avatar radius={'xl'} size={'38'} color="blue" variant="light">
                        <IconCalendar
                          stroke={1.5}
                          style={{
                            width: 24,
                            height: 24,
                            padding: 2,
                            marginTop: 5,
                            marginBottom: 5,
                          }}
                        />
                      </Avatar>
                      <Text size="md" fw={400}>
                        {dayjs(event?.startsAt).format('ddd MMM D')} to{' '}
                        {dayjs(event?.endsAt).format('ddd MMM D')}
                      </Text>
                    </Group>
                    <Group>
                      <Avatar radius={'xl'} size={'38'} color="blue" variant="light">
                        <IconMapPin
                          stroke={1.5}
                          style={{
                            width: 24,
                            height: 24,
                            padding: 2,
                            marginTop: 5,
                            marginBottom: 5,
                          }}
                        />
                      </Avatar>
                      <Text size="md">{event?.venue ? event?.venue : event?.mode}</Text>
                    </Group>
                  </Flex>
                </div>
                <Group gap={'0.2em'}>
                  {dayjs().isBefore(dayjs(event?.deadline)) ? (
                    <>
                    {user?<Button fullWidth disabled={event?.isRegistered} onClick={registerUser}>Register</Button>:<Button component={Link} href='/auth?t=login'>Login</Button>}
                    </>
                  ) : (
                    <Button
                      fullWidth
                      disabled
                    >
                      Event Ended
                    </Button>
                  )}
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={8}>
              <Title pl={'1em'} mb={'0.5em'} order={2}>
                Event Description
              </Title>
              <TypographyStylesProvider>
                <div dangerouslySetInnerHTML={{ __html: event?.longDescription }} />
              </TypographyStylesProvider>
            </Grid.Col>
            <Grid.Col span={4}></Grid.Col>
          </Grid>
        </Flex>
      </Paper>
      {/* <Container fluid {...demoProps}>
        <Flex direction="row">
          <Container>
            <Image src={event?.banner}></Image>
          </Container>
          <Container p={'10px'}>
            <Title order={2}>{event?.name}</Title>
            <Text size="xs" c="gray">
              {event?.hostedBy.map((h) => h.name).join(', ')}
            </Text>
            <Group gap={'0.2em'}>
              <Flex direction="row">
                <IconCalendar
                  stroke={1.5}
                  style={{ width: 32, height: 32, padding: 2, marginTop: 5, marginBottom: 5 }}
                />
                <Flex direction="column">
                  <Text size="md" fw={500}>
                    {dayjs(event?.startsAt).format('dddd MMM D')} <br />{' '}
                  </Text>
                  <Text size="md">to {dayjs(event?.endsAt).format('ddd MMM D')}</Text>
                </Flex>
              </Flex>
            </Group>
            <Group gap={'0.2em'}>
              <IconMapPin
                stroke={1.5}
                style={{ width: 32, height: 32, padding: 2, marginTop: 5, marginBottom: 5 }}
              />
              <Text size="md">{event?.venue ? event?.venue : event?.mode}</Text>
            </Group>
            <Group gap={'0.2em'}>
              {dayjs().isBefore(dayjs(event?.deadline)) ? (
                <Button fullWidth>Register</Button>
              ) : (
                <Button
                  fullWidth
                  variant="gradient"
                  gradient={{ from: 'gray', to: 'blue', deg: 90 }}
                >
                  Know More
                </Button>
              )}
            </Group>
          </Container>
        </Flex>
      </Container>
      <Container>
      <TypographyStylesProvider>
        <div dangerouslySetInnerHTML={{ __html: event?.longDescription }} />
    </TypographyStylesProvider>
      </Container> */}
    </>
  );
}
