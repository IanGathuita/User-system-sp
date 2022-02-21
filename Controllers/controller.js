const config = require("../Config/db");
const mssql = require('mssql');

const users_get = async (req, res) => {
    try {
        await mssql.connect(config);
        //excecute stored procedure
        //The sql object does not have an execute function. 
        //An instance of the sql.Request() object has an execute() function
        const result = await (new mssql.Request().execute('us_select_all')
            .then((result) => {
                res.send(result.recordset);
            }).catch((err) => {
                res.send(result);
                console.log(result);
            }));
    }
    catch (e) {
        console.log(e);
        res.send(e);
    }
}

const user_get = async (req, res) => {
    const id = req.params.id;
    try {
        await mssql.connect(config);
        const result = await (new mssql.Request()
        .input('id', mssql.VarChar(200), `${id}`)
        .execute('sp_get_specific')
            .then((result) => {
                res.send(result.recordset);
            }).catch((err) => {
                res.send(err);
                console.log(result);
            }));
    }
    catch (e) {
        console.log(e);
        res.send(e);
    }
}


const users_post = async (req, res) => {
    const { FirstName, SecondName, Email, Project, Password } = req.body;
    console.log(FirstName);
    try {
        await mssql.connect(config);
        await (new mssql.Request()
        .input('FirstName', mssql.VarChar(20), `${FirstName}`)
            .input('SecondName', mssql.VarChar(20), `${SecondName}`)
            .input('Email', mssql.VarChar(200), `${Email}`)
            .input('Project', mssql.VarChar(50), `${Project}`)
            .input('Password', mssql.VarChar(200), `${Password}`)
            
            .execute('sp_add_user')
            .then((result) => {
                res.json("User added successfully");
            }).catch((e) => {
                console.log(e);
                res.send(e);
            })
        );
    }
    catch (e) {
        console.log(e);
    }

}


const users_put = async (req, res) => {
    const id = req.params.id;
    const { FirstName, SecondName, Email, Project, Password } = req.body;
    try {
        await mssql.connect(config);
        const result = await (new mssql.Request()
        .input('FirstName', mssql.VarChar(20), `${FirstName}`)
            .input('SecondName', mssql.VarChar(20), `${SecondName}`)
            .input('Email', mssql.VarChar(200), `${Email}`)
            .input('Project', mssql.VarChar(50), `${Project}`)
            .input('Password', mssql.VarChar(200), `${Password}`)
            .input('id', mssql.VarChar(200), `${id}`)
        .execute(`sp_update_user`)
            .then((result) => {
                res.send("updated");
                console.log("updated");
            }).catch((err) => {
                res.send(err.message);
                console.log(err.message);
            }));
    } catch (e) {
        console.log(e);
        res.send(e);

    }
}

const users_delete = async (req, res) => {
    const id = req.params.id;
    try {
        await mssql.connect(config);
        const result = await (new mssql.Request()
        .input('id',mssql.Int,`${id}`)
        .execute(`sp_delete_user`)
            .then((result) => {
                res.send("deleted");
                console.log("deleted");
            }).catch((err) => {
                res.send(err.message);
                console.log(err.message);
            }));
    } catch (e) {
        console.log(e);
        res.send(e);

    }


}

module.exports = { users_get,user_get, users_post, users_put, users_delete };