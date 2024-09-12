import {
  AppBar,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { PropsWithChildren } from "react";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

export interface LayoutProps extends PropsWithChildren {
  resetAll: () => void;
  canGenerateProductionFile: boolean;
  generateProductionFile: () => void;
}

export function Layout(props: LayoutProps) {
  return (
    <Container
      maxWidth={false}
      sx={{
        // Dark cobalt gray background color
        backgroundColor: "#2E3B4D",
        height: "100vh",
        display: "flex",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "inherit",
          borderBottom: "1px solid #3E4E63",
        }}
        elevation={0}
      >
        <Toolbar>
          <BuildCircleIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Assembly</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          backgroundColor: "inherit",
          [`& .MuiDrawer-paper`]: { width: 250, boxSizing: "border-box" },
        }}
        PaperProps={{
          sx: {
            backgroundColor: "inherit",
            borderRight: "1px solid #3E4E63",
          },
        }}
      >
        <Toolbar />
        <List
          sx={{
            color: "white",
          }}
        >
          <ListItem key={"reset"} disablePadding>
            <ListItemButton onClick={props.resetAll}>
              <ListItemIcon>
                <RestartAltIcon
                  sx={{
                    color: "white",
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={"Reset All"} />
            </ListItemButton>
          </ListItem>
          {props.canGenerateProductionFile && (
            <ListItem key={"generate"} disablePadding>
              <ListItemButton onClick={props.generateProductionFile}>
                <ListItemIcon>
                  <ElectricBoltIcon
                    sx={{
                      color: "white",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={"Generate"} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box>{props.children}</Box>
      </Box>
    </Container>
  );
}
