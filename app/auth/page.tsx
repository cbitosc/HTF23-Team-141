"use client";
import { useToggle, upperFirst } from '@mantine/hooks';
import { Center, Box, SegmentedControl, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import {signIn, getCsrfToken} from "next-auth/react"
import { useSearchParams } from 'next/navigation'

export default function AuthenticationForm(props: PaperProps) {
  const searchParams = useSearchParams()
 
  const error = searchParams.get('error')
  const t = searchParams.get('t')

  const [type, toggle] = useToggle(t === "login" ? ['login', 'register']:['register', 'login']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const onSubmit = async (data) => {
    if (type=='register'){
      console.log("register",data)
      await fetch("/api/auth/register",{
        method: "POST",
        body: JSON.stringify(data)
      })
    }
    else {
      console.log("login",data)
      signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: '/dashboard'
      })
    }
  }

  return (
    <Center maw={"100%"} h={"100%"} bg="var(--mantine-color-gray-light)">
      <Paper radius="md" p="xl" withBorder {...props} w={350}>
        <SegmentedControl data={[{ label: 'Login', value: 'login' }, { label: 'Register', value: 'register' }]} fullWidth value={type} onChange={toggle} mb={"2em"}/>
      <Center><Text size="lg" fw={500}>
        Welcome to Mantine
      </Text></Center>

      {/* <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group> */}

      <Divider my="lg" />

      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />

          
        </Stack>
        {error && type=="login" && <Alert variant='outline' color="red" title="Error" mt={"2em"}>
          {error==="CredentialsSignin" && "Invalid username or password"}
        </Alert>}
        <Group justify="center" grow mt="xl">
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
    </Center >
  );
}