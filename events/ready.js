module.exports = {
    name: "ready",
    once: true,
    execute(client){
        function SetStatus() {
            client.user.setActivity(".gg/KnightOwl", {type: "PLAYING"})
            return "Status Set Successfully!"
        }
        let complete = SetStatus()
        console.log(complete)
		console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};