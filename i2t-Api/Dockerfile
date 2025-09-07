# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# copy published app
COPY --from=build /app/publish .

# tessdata + hunspell dictionaries
COPY i2t-Api/tessdata /app/tessdata
COPY i2t-Api/Dictionaries /app/Dictionaries

ENV TESSDATA_PREFIX=/app/tessdata

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
