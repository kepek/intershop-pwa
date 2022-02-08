Requires following path in environment.proxy.ts

apiMockPaths: ['^ICC/ahu/.*', '^customers/120033/users/pawel.butrafi/requisitions/*'],

'camRequisitionManagement' feature toggled

Currently most of endpoint are mocked and stored in mock-data folder.

Rename following folder to your own userid and user login or use my user to develop requisitions
columbus-camfil-pwa\src\assets\mock-data\customers\120033\users\pawel.butrafi\requisitions
columbus-camfil-pwa\src\assets\mock-data\customers\${userId}\users\${login}
