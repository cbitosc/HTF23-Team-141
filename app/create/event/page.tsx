'use client';
import { HeaderMegaMenu } from '@/components/Header';
import { Button, FileInput, Group, InputLabel, Paper, Select, TextInput, Textarea, Title } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
// import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Superscript from '@tiptap/extension-superscript';
// import SubScript from '@tiptap/extension-subscript';

export default function CreateEventPage() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: 'hello',
  });

  const form = useForm({
    initialValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      venue: "",
      startsAt: "",
      endsAt: "",
      deadline: "",
      mode: "",
      banner: ""
    },

    validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const [banner, setBanner] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState();

//   useEffect(()=>{
//     const form = new FormData()
//     form.set('file', banner)
//     fetch('/api/upload', {
//         method: 'POST',
//         body: form
//     }).then(res=>res.json()).then()
//   },[banner])

const handleSubmit = async (values) => {
    const response = await fetch("/api/events",{
        method: "POST",
        redirect: 'follow',
        body: JSON.stringify(values)
    })
    if (response.redirected) {
        window.location.href = response.url;
    }
}

  return (
    <>
      <HeaderMegaMenu></HeaderMegaMenu>
      <Paper shadow="md" m={'8em'} p={'5em'}>
        <Title>Create Event</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group grow>
          <TextInput label="Name" {...form.getInputProps('name')}></TextInput>
          <Select label="Mode" placeholder="Pick value" data={['Online', 'Offline']} {...form.getInputProps('mode')}/>
        </Group>
        <Textarea label="Short Description" {...form.getInputProps('shortDescription')}></Textarea>
        <Textarea label="Long Description" {...form.getInputProps('longDescription')}></Textarea>
        {/* <RichTextEditor editor={editor}>
          <RichTextEditor.Content />
        </RichTextEditor> */}
        <Group grow>
          <DateTimePicker label="Starts At" {...form.getInputProps('startsAt')}></DateTimePicker>
          <DateTimePicker label="Ends At" {...form.getInputProps('endsAt')}></DateTimePicker>
        </Group>
        <DateTimePicker label="Deadline" {...form.getInputProps('deadline')}></DateTimePicker>
        <TextInput label="Venue" {...form.getInputProps('venue')}></TextInput>
        <TextInput label="Banner URL" {...form.getInputProps('banner')}></TextInput>
        <Button type="submit" mt="1em">Create</Button>
        </form>
      </Paper>
    </>
  );
}
