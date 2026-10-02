import {Formik, Form, Field, ErrorMessage} from 'formik';

export default function Home() {
  return (
    <Formik
      initialValues={{ files: null, password: '' }}
      onSubmit={(values) => {
        console.log(values.files);
      }}
    >
      <Form>
        <Field name="files" type="file" />
        <Field name="password" type="password" />
        <ErrorMessage name="files" component="div" />
        <ErrorMessage name="password" component="div" />
        <button type="submit">Enviar</button>
      </Form>
    </Formik>
  );
}
