import React from "react"

import Layout from "../hocs/Layout"
import usePageTitle from "../hooks/hooks";


function Home(){
    usePageTitle('Login'); // title
    return(  //
        <Layout page="Home">
            <div className="text-blue-500">
                <h4>Pagina de inicio...</h4>
            </div>
        </Layout>
    )
}

export default Home