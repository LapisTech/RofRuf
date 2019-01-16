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
			top: <Top>document.querySelector( 'page-top' ),
			main: <Main>document.querySelector( 'page-main' ),
			egg: <Egg>document.querySelector( 'page-egg' ),
		},
		menu:
		{
			lang: document.querySelectorAll( '.lang' ),
		},
	} );
} );
