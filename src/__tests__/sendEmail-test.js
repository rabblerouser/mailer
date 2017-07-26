const sendEmail = require('../sendEmail');
const streamClient = require('../streamClient');
const ses = require('../ses');

describe('sendEmail', () => {
  let sandbox;
  const email = {
    id: '123-456',
    from: 'campaigns@rabblerouser.team',
    to: ['john@example.com', 'jane@example.com'],
    subject: 'Do the thing!',
    body: 'It is very important that you do the thing.',
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(ses, 'sendEmail');
    sandbox.stub(streamClient, 'publish').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const awsSuccess = data => ({ promise: () => Promise.resolve(data) });
  const awsFailure = error => ({ promise: () => Promise.reject(error) });

  it('sends an email to each recipient', () => {
    ses.sendEmail.returns(awsSuccess());

    return sendEmail(email).then(() => {
      expect(ses.sendEmail).to.have.been.calledWith({
        Source: 'campaigns@rabblerouser.team',
        ReplyToAddresses: ['campaigns@rabblerouser.team'],
        Destination: { ToAddresses: ['john@example.com'] },
        Message: {
          Subject: { Data: 'Do the thing!' },
          Body: {
            Html: { Data: 'It is very important that you do the thing.' },
          },
        },
      });
      expect(ses.sendEmail).to.have.been.calledWith({
        Source: 'campaigns@rabblerouser.team',
        ReplyToAddresses: ['campaigns@rabblerouser.team'],
        Destination: { ToAddresses: ['jane@example.com'] },
        Message: {
          Subject: { Data: 'Do the thing!' },
          Body: {
            Html: { Data: 'It is very important that you do the thing.' },
          },
        },
      });
    });
  });

  it('publishes a single event for all email successes', () => {
    ses.sendEmail.returns(awsSuccess());

    return sendEmail(email).then(() => {
      expect(streamClient.publish).to.have.been.calledWith('email-sent', {
        emailId: '123-456',
        to: ['john@example.com', 'jane@example.com'],
      });
      expect(streamClient.publish.callCount).to.eql(1);
    });
  });

  it('does not publish an email success event if they all failed', () => {
    ses.sendEmail.returns(awsFailure());
    return sendEmail(email).then(() => {
      expect(streamClient.publish).not.to.have.been.calledWith('email-sent', sinon.match.any);
    });
  });

  it('publishes a single event for all email failures', () => {
    ses.sendEmail.returns(awsFailure());
    return sendEmail(email).then(() => {
      expect(streamClient.publish).to.have.been.calledWith('email-failed', {
        emailId: '123-456',
        to: ['john@example.com', 'jane@example.com'],
      });
      expect(streamClient.publish.callCount).to.eql(1);
    });
  });

  it('does not publish an email failure event if they all succeeded', () => {
    ses.sendEmail.returns(awsSuccess());
    return sendEmail(email).then(() => {
      expect(streamClient.publish).not.to.have.been.calledWith('email-failed', sinon.match.any);
    });
  });

  it('continues sending emails when email sending fails', () => {
    ses.sendEmail.onCall(0).returns(awsFailure());
    ses.sendEmail.onCall(1).returns(awsSuccess());

    return sendEmail(email).then(() => {
      expect(ses.sendEmail.callCount).to.eql(2);
    });
  });
});