import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home";
import Title from "./components/title";
import { Error404 } from "./pages/404";
import { RoomPage } from "./pages/room";
import { ListPage } from "./pages/list";


export const App: FC = () => (
    <>
        <Title/>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/room/:roomName" element={<RoomPage/>}/>
                <Route path="/list" element={<ListPage/>}/>
                <Route path="*" element={<Error404/>}/>
            </Routes>
        </BrowserRouter>
    </>
);