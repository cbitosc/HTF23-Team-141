'use client';
import { HeaderMegaMenu } from '@/components/Header';
import { Button, Card, CardSection, Flex, Group, Image, Stack, Text, Title, Tabs } from '@mantine/core';
import prisma from '@/lib/db';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { IconCalendar, IconMap2, IconMapPin } from '@tabler/icons-react';
import { forEach } from 'lodash';
import Link from 'next/link';

export default function HomePage() {
  const [upcomingEvents, setUpcoming] = useState<any[]>([]);
  const [ongoingEvents, setOngoing] = useState<any[]>([]);

  useEffect(() => {
    async function a() {
      const res = await fetch('/api/events');
      const e = (await res.json()).events;
      const upcoming = e.filter(e=>dayjs().isBefore(dayjs(e.startsAt)))
      const ongoing = e.filter(e=>dayjs().isAfter(dayjs(e.startsAt)) && dayjs().isBefore(dayjs(e.endsAt)))
      setUpcoming(upcoming);
      setOngoing(ongoing)
    }
    a();
  }, []);

  return (
    <>
      <HeaderMegaMenu></HeaderMegaMenu>
      <Title mb={12} ml={12} order={1}>
        Explore Events
      </Title>
      <Tabs defaultValue="upcoming" mx={12}>
      <Tabs.List>
        <Tabs.Tab value="upcoming">
          Upcoming
        </Tabs.Tab>
        <Tabs.Tab value="ongoing">
          Ongoing
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="upcoming">
        <Flex p={'1em'} gap={'1em'}>
        {upcomingEvents.map((e) => (
            <EventCard event={e} />
          ))}
        </Flex>
      </Tabs.Panel>

      <Tabs.Panel value="ongoing">
      <Flex p={'1em'} gap={'1em'}>
      {ongoingEvents.map((e) => (
          <EventCard event={e} />
        ))}
      </Flex>
      </Tabs.Panel>
    </Tabs>
      
      
    </>
  );
}

const EventCard = ({ event }) => {
  return (
    <Card w="300px" h="400px" shadow="lg" p={0} px={"1em"}>
      <Stack justify='space-between' style={{height: "100%"}} gap={0}>
      <div>
        <CardSection>
          <Image src={event.banner}></Image>
        </CardSection>
        <CardSection p="sm">
          <Flex gap="10px" direction="column">
            <Flex direction={'column'}>
              <Text fw={500}>{event.name}</Text>
              <Text size="xs">{event.hostedBy.map((h) => h.name).join(', ')}</Text>
            </Flex>
            <Text size="xs" lineClamp={3}>{event.shortDescription}</Text>
          </Flex>
        </CardSection>
      </div>
      <CardSection p="sm">
        <Flex direction={'column'} gap="10px">
          <Group gap={'0.2em'}>
            <IconCalendar stroke={1.5} style={{ width: 20, height: 20 }} />
            <Text size="xs">
              {dayjs(event.startsAt).format('ddd MMM D')} -{' '}
              {dayjs(event.endsAt).format('ddd MMM D')}
            </Text>
          </Group>
          <Group gap={'0.2em'}>
            <IconMapPin stroke={1.5} style={{ width: 20, height: 20 }} />
            <Text size="xs">{event.venue ? event.venue : event.mode}</Text>
          </Group>
          <Group gap={'0.2em'}>
            {dayjs().isBefore(dayjs(event.deadline)) ? (
              <Button fullWidth component={Link} href={`/event/${event.id}`}>Register</Button>
            ) : (
              <Button fullWidth component={Link} href={`/event/${event.id}`} variant="gradient" gradient={{ from: 'gray', to: 'blue', deg: 90 }}>
                Know More
              </Button>
            )}
          </Group>
        </Flex>
      </CardSection>
      </Stack>
    </Card>
  );
};
