import Layout from "../components/layout/Layout";
import { Courses } from "../components/courses/CourseList";
import { useAuth } from "../auth/hooks/useAuth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const IndexPage: NextPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <Layout>
      {isAuthenticated ? (
        <Courses title="Courses" />
      ) : (
        <div
          style={{
            textAlign: "center",
            margin: "0 auto",
            paddingTop: "3rem",
            fontSize: "24px",
            lineHeight: 1,
          }}
        >
          <h1>Engage students in project activities</h1>
          <p style={{ marginTop: 0, marginBottom: "4rem" }}>
            Help your students keep engaged in project activities
          </p>
          <Button
            onClick={() => router.push("/auth")}
            color="primary"
            style={{
              padding: "1rem 1.5rem",
              textTransform: "none",
              fontSize: "24px",
              fontWeight: "normal",
              letterSpacing: "-0.1px",
            }}
            variant="contained"
          >
            Get Started &nbsp;
            <ArrowForwardIcon />
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default IndexPage;
