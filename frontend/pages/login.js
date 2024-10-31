import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Stack,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Image from 'next/image';
import { Field, Form, Formik } from "formik";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from 'next/router';
import loginImg from "@/public/auth/login_image.png";
import { initialValues } from "@/component/auth/yupAndInitialValues";
import { mainColor } from "@/constants/Colors";
import AppContext from "@/AppContext";
import API from '@/helpers/ApiBuilder';

export const Login = () => {
  const { userInfo, setUserInfo } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  const emailInputRef = useRef(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleLogin = async (values, actions) => {
    try {
      const loginResponseSource = await API.post('login', values);
      const loginResponse = loginResponseSource.data;

      const accessToken = loginResponse?.access;
      if (accessToken) {
        document.cookie = `accessToken=${accessToken};`;
        router.push('/');
      } else {
        setLoginError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setLoginError('Login failed. Please check your credentials.');
    }
    actions.setSubmitting(false);
  };

  const redirectToRegister = () => {
    router.push("/register");
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Grid container alignItems="center" justifyContent="center" sx={{ height: "100%", paddingTop: 4 }}> {/* Boşluğu daraltmak için paddingTop ekledik */}
        <Grid item md={6} xl={6} sx={{ padding: "5rem", display: { xs: "none", sm: "block" } }}>
          <Image src={loginImg} height={400} alt="Login Image" style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
        </Grid>
        <Grid item xs={12} md={6} xl={4} sx={{ padding: "2rem" }}>
          <Card sx={{ maxWidth: "100%", padding: "1rem", overflow: 'hidden' }}>
            <CardContent>
              <Formik
                initialValues={initialValues}
                onSubmit={handleLogin}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form noValidate>
                    <Field
                      as={TextField}
                      type="email"
                      variant="outlined"
                      label="E-Mail"
                      name="email"
                      fullWidth
                      margin="dense"
                      error={Boolean(errors.email) && Boolean(touched.email)}
                      helperText={Boolean(touched.email) && errors.email}
                      inputProps={{ autoComplete: "off" }} // Prevent autofill
                      sx={{ mb: 2 }} // Margin bottom for spacing
                    />
                    <Field
                      as={TextField}
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      label="Şifre"
                      name="password"
                      fullWidth
                      margin="dense"
                      error={Boolean(errors.password) && Boolean(touched.password)}
                      helperText={Boolean(touched.password) && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" sx={{ pr: 2 }}>
                            <IconButton
                              edge="end"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }} // Margin bottom for spacing
                    />
                    {errors.general && (
                      <Typography color="error" variant="body2">
                        {errors.general}
                      </Typography>
                    )}
                    {loginError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {loginError}
                      </Alert>
                    )}
                    <Stack justifyContent="center" alignItems="center" mt={2}>
                      <Button
                        sx={{ border: 1, borderColor: "grey.500", color: "#212121", width: "50%", ':hover': { bgcolor: mainColor } }}
                        type="submit"
                        size="large"
                        disabled={isSubmitting}
                      >
                        Giriş Yap
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
              <Typography
                variant="subtitle2"
                align="center"
                component="div"
                onClick={redirectToRegister}
                sx={{ cursor: "pointer", mt: 1, color: mainColor }}
              >
                Hesabınız yok mu?
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
