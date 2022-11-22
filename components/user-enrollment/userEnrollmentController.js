// const log4js = require('log4js');
// const config = require('config');
const util = require("../../helpers/util");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const mime = require("mime-types");

const User = require("./userEnrollmentModel");
const UserImage = require("./userImageModel.js");
const Admin = require("./adminModel");
const PersonalInfo = require("../faculty/basic-info/personal/personalInfoModel");
const FacultyUnit = require("../faculty/basic-info/unit/facultyUnitModel");
const EmploymentInfo = require("../faculty/basic-info/employment/employmentInfoModel");

// const logger = log4js.getLogger('controllers - userEnrollment');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const userEnrollment = {};

userEnrollment.getUserImage = async (req, res) => {
  let jsonRes;

  try {
    const getUser = await UserImage.findOne({
      where: {
        userId: req.params.userId,
      },
    });

    if (getUser) {
      jsonRes = {
        statusCode: 200,
        success: true,
        result: getUser.dataValues,
      };
    } else {
      jsonRes = {
        statusCode: 200,
        success: false,
      };
    }
  } catch (error) {
    jsonRes = {
      statusCode: 500,
      success: false,
    };
  } finally {
    util.sendResponse(res, jsonRes);
  }
};

userEnrollment.addUserImage = async (req, res) => {
  let jsonRes;

  try {
    let filename;

    if (req.files && req.files.image) {
      let image = req.files.image;
      let name = image.name;
      let fileExtension = mime.extension(image.mimetype);

      filename = util.createRandomString(name.length);
      filename += "." + fileExtension;

      let path = "uploads/" + filename;
      image.mv(path);
    }

    [row, created] = await UserImage.findOrCreate({
      where: {
        userId: req.body.userId,
      },
      defaults: {
        userId: req.body.userId,
        image: filename,
      },
    });

    if (!created) {
      const [instance, created] = await UserImage.upsert({
        userId: row.dataValues.userId,
        imageId: row.dataValues.imageId,
        image: filename,
      });
      if (!created) {
        util.deleteFile(row.dataValues.image)

        jsonRes = {
          statusCode: 200,
          success: true,
          message: "Profile picture updated successfully",
        };
      }
    } else {
      jsonRes = {
        statusCode: 200,
        success: true,
        message: "Profile picture added successfully",
      };
    }
  } catch (error) {
    jsonRes = {
      statusCode: 500,
      success: false,
      error: error,
    };
  } finally {
    util.sendResponse(res, jsonRes);
  }
};

userEnrollment.userEnroll = async (req, res) => {
  // logger.info('inside userEnroll()...');
  // console.log('inside userEnroll()...');

  let jsonRes;

  const salt = util.getSalt();
  const passwordHash = util.hashPassword(req.body.password, salt);

  try {
    let [usr, created] = await User.findOrCreate({
      where: { upemail: req.body.upemail },
      defaults: {
        role: req.body.role,
        status: "Active",
        upemail: req.body.upemail,
        password: passwordHash,
        salt: salt,
      },
    });

    if (!created) {
      jsonRes = {
        statusCode: 400,
        success: false,
        message: "UP Email already exists",
      };
    } else {
      // check if role id is (1,2,3) -> Create faculty personal information
      if (
        ["1", "2", "3"].indexOf(req.body.role) != -1 &&
        req.body.personalInfo
      ) {
        try {
          let [fclty, created] = await PersonalInfo.findOrCreate({
            where: { userId: usr.userId },
            defaults: {
              userId: usr.userId,
              lastName: req.body.personalInfo.lastName,
              firstName: req.body.personalInfo.firstName,
              middleName: req.body.personalInfo.middleName,
              dateOfBirth: req.body.personalInfo.dateOfBirth,
              placeOfBirth: req.body.personalInfo.placeOfBirth,
              gender: req.body.personalInfo.gender,
              permanentAddress: req.body.personalInfo.permanentAddress,
              presentAddress: req.body.personalInfo.presentAddress,
              mobile: req.body.personalInfo.mobile,
              landline: req.body.personalInfo.landline,
              email: req.body.personalInfo.email,
              civilStatus: req.body.personalInfo.civilStatus,
              religion: req.body.personalInfo.religion,
              emergencyContactPerson:
                req.body.personalInfo.emergencyContactPerson,
              emergencyContactNumber:
                req.body.personalInfo.emergencyContactNumber,
              teachingPhilosophy: req.body.personalInfo.teachingPhilosophy,
            },
          });
          if (!created) {
            jsonRes = {
              statusCode: 400,
              success: false,
              message: "Faculty already exists",
            };
          } else {
            let [, created] = await FacultyUnit.findOrCreate({
              where: { facultyId: fclty.facultyId },
              defaults: {
                facultyId: fclty.facultyId,
                unitId: req.body.unitId,
              },
            });
            if (!created) {
              jsonRes = {
                statusCode: 400,
                success: false,
                message: "Faculty already assigned to a unit",
              };
            } else {
              let [, created] = await EmploymentInfo.findOrCreate({
                where: {
                  facultyId: fclty.facultyId,
                  employmentPositionId: req.body.employmentPositionId,
                },
                defaults: {
                  facultyId: fclty.facultyId,
                  employmentPositionId: req.body.employmentPositionId,
                  status: req.body.status,
                  category: req.body.category,
                  startDate: req.body.startDate,
                },
              });

              if (!created) {
                jsonRes = {
                  statusCode: 400,
                  success: false,
                  message:
                    "Faculty already has existing employment information",
                };
              } else {
                jsonRes = {
                  statusCode: 200,
                  success: true,
                  message: "Faculty added successfully",
                  result: {
                    facultyId: fclty.facultyId,
                  },
                };
              }
            }
          }
        } catch (error) {
          jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
          };
        }
      } else if (req.body.role == 5) {
        // if admin staff
        try {
          let [adminInfo, created] = await Admin.findOrCreate({
            where: { userId: usr.userId },
            defaults: {
              userId: usr.userId,
              name: req.body.name,
            },
          });
          if (!created) {
            jsonRes = {
              statusCode: 400,
              success: false,
              message: "Admin already exists",
            };
          } else {
            jsonRes = {
              statusCode: 200,
              success: true,
              message: "Admin added successfully",
              result: {
                adminId: adminInfo.adminId,
              },
            };
          }
        } catch (error) {
          jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
          };
        }
      } else {
        jsonRes = {
          statusCode: 200,
          success: true,
          message: "User enrolled successfully",
        };
      }
    }
  } catch (error) {
    jsonRes = {
      statusCode: 500,
      success: false,
      error: error,
    };
  }
  util.sendResponse(res, jsonRes);
};

userEnrollment.editUser = async (req, res) => {
  // logger.info('inside editUser()...');

  let jsonRes;

  try {
    let body = {
      role: req.body.role,
      status: req.body.status,
      remarks: req.body.remarks,
    };
    if (req.body.password) {
      const salt = util.getSalt();
      const passwordHash = util.hashPassword(req.body.password, salt);
      body.password = passwordHash;
      body.salt = salt;
    }

    let updated = await User.update(body, {
      where: { userId: req.params.userId },
    });

    if (updated == 0) {
      jsonRes = {
        statusCode: 400,
        success: false,
        message: "Faculty user information cannot be updated",
      };
    } else {
      jsonRes = {
        statusCode: 200,
        success: true,
        message: "Faculty user information updated successfully",
      };
    }
  } catch (error) {
    jsonRes = {
      statusCode: 500,
      success: false,
      error: error,
    };
  } finally {
    util.sendResponse(res, jsonRes);
  }
};

userEnrollment.getAdminUser = async (req, res) => {
  // logger.info('inside getAdminUser()...');

  let jsonRes;

  try {
    let adminList = await Admin.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [["name"]],
    });

    if (adminList.length === 0) {
      jsonRes = {
        statusCode: 200,
        success: true,
        result: null,
        message: "Admin not found",
      };
    } else {
      jsonRes = {
        statusCode: 200,
        success: true,
        result: adminList,
      };
    }
  } catch (error) {
    jsonRes = {
      statusCode: 500,
      success: false,
      error: error,
    };
  } finally {
    util.sendResponse(res, jsonRes);
  }
};

userEnrollment.deleteAdminUser = async (req, res) => {
  // logger.info('inside deleteAdminUser()...');

  let jsonRes;
  let deleted;

  try {
    deleted = await Admin.destroy({
      where: { userId: req.params.userId },
    });

    if (deleted == 0) {
      jsonRes = {
        statusCode: 400,
        success: false,
        message: "Admin cannot be deleted",
      };
    } else {
      deleted = await User.destroy({
        where: { userId: req.params.userId },
      });
      if (deleted == 0) {
        jsonRes = {
          statusCode: 400,
          success: false,
          message: "Admin cannot be deleted",
        };
      } else {
        jsonRes = {
          statusCode: 200,
          success: true,
          message: "Admin deleted successfully",
        };
      }
    }
  } catch (error) {
    jsonRes = {
      statusCode: 500,
      success: false,
      error: error,
    };
  } finally {
    util.sendResponse(res, jsonRes);
  }
};

userEnrollment.comparePassword = async (req, res) => {
  let jsonRes;

  try {
    const getUser = await User.findOne({
      where: { userId: req.body.userId },
      attributes: ["password", "salt"],
    });

    const password = req.body.password;

    let salt = getUser.salt;
    const passwordHash = util.hashPassword(password, salt);

    if (passwordHash === getUser.password) {
      jsonRes = {
        statusCode: 200,
        success: true,
      };
    } else {
      jsonRes = {
        statusCode: 500,
        success: false,
      };
    }
  } catch (error) {
    jsonRes = {
      statusCode: 500,
      success: false,
    };
  } finally {
    util.sendResponse(res, jsonRes);
  }
};

userEnrollment.sendEmail = async (req, res) => {
  let jsonRes;

  const getUser = await User.findOne({
    where: { upemail: req.body.upemail },
    attributes: ["userId", "password"],
  });

  if (!getUser) {
    jsonRes = {
      statusCode: 400,
      success: false,
      error: "UP email does not exist",
    };
    util.sendResponse(res, jsonRes);
  } else {
    const payload = {
      upemail: req.body.upemail,
      userId: getUser.userId,
    };

    const token = await jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });

    const link = `${process.env.WEB_URL}/reset-password/${getUser.userId}/${token}`;

    /** NOTE: Change to transporter of choice for deployment. For demo purposes, currently using mailtrap */
    const transporter = await nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "api",
        pass: "388d6441a4b4f9f7c85cbfc8b2af116c",
      },
    });

    let info = {
      from: `"DPSM QA Portal" <noreply@${process.env.WEB_URL}>`, // sender address
      to: req.body.upemail, // list of receivers
      subject: "DPSM QA Portal Reset Password", // Subject line
      text: "DPSM QA Portal Reset Password", // plain text body
      html: `
            <h3> Good day, </h3>
            <p>You have requested a password reset to DPSM QA Portal from this account.
            To reset your password, please click the following link: <br /><br />
            <button type="button"><a href="${link}">Reset Password</a></button>
            If the button is not working, you may also copy and paste this link to the browser: <br /><br />
            <a href="${link}">${link}</a> <br /><br />
            This link will expire in 1 hour. <br /><br />
            </p>`, // html body
    };

    // mask email
    const email = req.body.upemail.split("@");
    let maskedEmail = email[0].charAt(0);
    for (let index = 1; index < email[0].length - 1; index++) {
      const element = email[0][index];
      maskedEmail += "*";
    }
    maskedEmail += email[0].slice(-1) + "@" + email[1];

    await transporter.sendMail(info, (err, info) => {
      if (err) {
        jsonRes = {
          statusCode: 500,
          success: false,
          message: "Email not sent",
          error: err,
        };
        util.sendResponse(res, jsonRes);
      } else {
        jsonRes = {
          statusCode: 200,
          success: true,
          message: "Email sent to " + maskedEmail,
          result: {
            messageId: info.messageId,
          },
        };
        util.sendResponse(res, jsonRes);
      }
    });
  }
};

userEnrollment.verifyToken = async (req, res) => {
  let jsonRes;

  try {
    // validate user id
    const getUser = await User.findOne({
      where: { userId: req.params.userId },
      attributes: ["password", "salt"],
    });

    if (!getUser) {
      jsonRes = {
        statusCode: 400,
        success: false,
        message: "User does not exist",
      };
    } else {
      const payload = await jwt.verify(
        req.params.token,
        process.env.TOKEN_SECRET
      );

      jsonRes = {
        statusCode: 200,
        success: true,
        message: "Token verified",
      };
    }
  } catch (error) {
    jsonRes = {
      statusCode: 500,
      success: false,
      error: error,
    };
  } finally {
    util.sendResponse(res, jsonRes);
  }
};

userEnrollment.resetPassword = async (req, res) => {
  let jsonRes;

  try {
    // validate user id
    const getUser = await User.findOne({
      where: { userId: req.params.userId },
      attributes: ["password", "salt"],
    });

    await jwt.verify(req.params.token, process.env.TOKEN_SECRET);

    // find user with the payload upemail & id
    const passwordHash = util.hashPassword(req.body.password, getUser.salt);

    let updated = await User.update(
      { password: passwordHash },
      {
        where: { userId: req.params.userId },
      }
    );

    if (updated == 0) {
      jsonRes = {
        statusCode: 400,
        success: false,
        message: "Password reset failed",
      };
    } else {
      jsonRes = {
        statusCode: 200,
        success: true,
        message: "Password reset successfully",
      };
    }
  } catch (error) {
    jsonRes = {
      statusCode: 500,
      success: false,
      error: error,
    };
  } finally {
    util.sendResponse(res, jsonRes);
  }
};

module.exports = userEnrollment;
