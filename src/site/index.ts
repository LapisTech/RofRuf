/// <reference path="./App.ts" />

document.addEventListener( 'DOMContentLoaded', () =>
{
	const app = new App(
	{
		popup: <Popup>document.getElementById( 'popup' ),
		dialog: <Dialog>document.getElementById( 'dialog' ),
		message: <Message>document.getElementById( 'message' ),
		page:
		{
			main: <Main>document.querySelector( 'page-main' ),
			egg: <Egg>document.querySelector( 'page-egg' ),
		},
	} );
} );
