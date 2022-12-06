import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import React from "react";

export const TodoCard = (props) => {
  const { data, deleteItem, updatebtn, fetchData } = props;

  return (
    <div>
      <Container
        sx={[
          { py: 8 },
          fetchData && { display: "flex", justifyContent: "center" },
        ]}
        maxWidth="md"
      >
        {/* End hero unit */}
        {fetchData ? (
          <CircularProgress disableShrink style={{ color: "#fff" }} />
        ) : (
          <Grid container spacing={4}>
            {data?.map((card, index) => (
              <Grid item key={card?.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card?.name}
                    </Typography>
                    <Typography style={{ wordBreak: "break-all" }}>
                      {card?.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <LoadingButton
                      size="small"
                      onClick={() => deleteItem(card.id, index)}
                      // loading={deleteLoading}
                    >
                      <DeleteIcon />
                    </LoadingButton>
                    <LoadingButton
                      size="small"
                      onClick={() => updatebtn(card, index)}
                      // loading={true}
                    >
                      <UpdateIcon />
                    </LoadingButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};
